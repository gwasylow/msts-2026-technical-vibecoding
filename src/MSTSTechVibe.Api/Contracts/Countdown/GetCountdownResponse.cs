namespace MSTSTechVibe.Api.Contracts.Countdown;

public sealed record GetCountdownResponse(
    string Headline,
    DateTimeOffset DeadlineUtc);
