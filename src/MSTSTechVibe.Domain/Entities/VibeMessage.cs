namespace MSTSTechVibe.Domain.Entities;

public sealed class VibeMessage
{
    private VibeMessage(Guid id, string title, string description, DateTimeOffset createdAtUtc, string createdByUserId)
    {
        Id = id;
        Title = title;
        Description = description;
        CreatedAtUtc = createdAtUtc;
        CreatedByUserId = createdByUserId;
    }

    public Guid Id { get; }

    public string Title { get; }

    public string Description { get; }

    public DateTimeOffset CreatedAtUtc { get; }

    public string CreatedByUserId { get; }

    public static VibeMessage Create(string title, string description, string createdByUserId)
    {
        return new VibeMessage(
            Guid.NewGuid(),
            title.Trim(),
            description.Trim(),
            DateTimeOffset.UtcNow,
            createdByUserId);
    }
}