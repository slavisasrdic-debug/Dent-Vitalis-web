export function videoDescription(
  section: string,
  title: string,
  videoId: string,
): string {
  if (!section.trim() || !title.trim())
    throw new Error(`Missing visible video description: ${videoId}`);
  return `${section.trim()}: ${title}`;
}

export function verifiedVideoDateTime(value: string): string {
  if (
    !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) !==
      value.slice(0, 10)
  )
    throw new Error(
      `Video publication datetime must include its verified timezone: ${value}`,
    );
  return value;
}
