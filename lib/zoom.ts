type ZoomMeetingInput = {
  topic: string;
  startsAt: Date;
  durationMinutes: number;
};

export async function createZoomMeeting(input: ZoomMeetingInput) {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  if (!accountId || !clientId || !clientSecret) {
    throw new Error(
      "Zoom is not configured. Add the ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, and ZOOM_CLIENT_SECRET environment variables.",
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const tokenResponse = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`,
    {
      method: "POST",
      headers: { Authorization: `Basic ${credentials}` },
      cache: "no-store",
    },
  );
  if (!tokenResponse.ok) throw new Error("Zoom authorization failed.");
  const token = (await tokenResponse.json()) as { access_token: string };

  const meetingResponse = await fetch(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: input.topic,
        type: 2,
        start_time: input.startsAt.toISOString(),
        duration: input.durationMinutes,
        timezone: "UTC",
        settings: { join_before_host: false, waiting_room: true },
      }),
    },
  );
  if (!meetingResponse.ok)
    throw new Error("Zoom could not create the meeting.");
  const meeting = (await meetingResponse.json()) as {
    id: number;
    join_url: string;
  };
  return { id: String(meeting.id), url: meeting.join_url };
}
