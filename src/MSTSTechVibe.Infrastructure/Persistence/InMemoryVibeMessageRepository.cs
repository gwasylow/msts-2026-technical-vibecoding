using System.Collections.Concurrent;
using MSTSTechVibe.Application.Abstractions.Persistence;
using MSTSTechVibe.Domain.Entities;

namespace MSTSTechVibe.Infrastructure.Persistence;

public sealed class InMemoryVibeMessageRepository : IVibeMessageRepository
{
    private readonly ConcurrentDictionary<Guid, VibeMessage> _messages = new();

    public InMemoryVibeMessageRepository()
    {
        Seed();
    }

    public Task<IReadOnlyCollection<VibeMessage>> GetAllAsync(CancellationToken cancellationToken)
    {
        IReadOnlyCollection<VibeMessage> messages = _messages.Values.ToArray();
        return Task.FromResult(messages);
    }

    public Task<VibeMessage> AddAsync(VibeMessage vibeMessage, CancellationToken cancellationToken)
    {
        _messages[vibeMessage.Id] = vibeMessage;
        return Task.FromResult(vibeMessage);
    }

    private void Seed()
    {
        var seededMessages = new[]
        {
            VibeMessage.Create(
                "Ship the vertical slice",
                "The API exposes a CQRS-first endpoint surface that a Next.js client can consume.",
                "seed-user"),
            VibeMessage.Create(
                "Keep contracts stable",
                "Controllers stay thin while MediatR handlers own orchestration and validation.",
                "seed-user")
        };

        foreach (var message in seededMessages)
        {
            _messages[message.Id] = message;
        }
    }
}