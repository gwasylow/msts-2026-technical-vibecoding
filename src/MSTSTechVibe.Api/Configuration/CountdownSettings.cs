namespace MSTSTechVibe.Api.Configuration;

public sealed class CountdownSettings
{
    public const string SectionName = "Countdown";

    public string Headline { get; set; } = "Countdown to the next milestone";

    public DateTimeOffset DeadlineUtc { get; set; } = DateTimeOffset.UtcNow.AddMonths(1);
}
