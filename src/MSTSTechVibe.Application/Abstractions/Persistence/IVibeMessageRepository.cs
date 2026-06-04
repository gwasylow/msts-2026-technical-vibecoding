using MSTSTechVibe.Domain.Entities;

namespace MSTSTechVibe.Application.Abstractions.Persistence;

public interface IVibeMessageRepository
{
    Task<IReadOnlyCollection<VibeMessage>> GetAllAsync(CancellationToken cancellationToken);

    Task<VibeMessage> AddAsync(VibeMessage vibeMessage, CancellationToken cancellationToken);
}