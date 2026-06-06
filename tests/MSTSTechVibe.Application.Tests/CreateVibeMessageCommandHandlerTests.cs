using MSTSTechVibe.Application.Abstractions.Authentication;
using MSTSTechVibe.Application.Abstractions.Persistence;
using MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;
using MSTSTechVibe.Domain.Entities;

namespace MSTSTechVibe.Application.Tests;

public sealed class CreateVibeMessageCommandHandlerTests
{
    [Fact]
    public async Task Handle_ShouldPersistMessageForAuthenticatedUser()
    {
        var repository = new FakeVibeMessageRepository();
        var userContext = new FakeUserContext("user-123");
        var handler = new CreateVibeMessageCommandHandler(repository, userContext);

        var response = await handler.Handle(new CreateVibeMessageCommand("New slice", "Ready for the Next.js dashboard."), CancellationToken.None);

        Assert.Equal("New slice", response.Title);
        Assert.Equal("user-123", response.CreatedByUserId);
        Assert.Single(repository.Messages);
    }

    private sealed class FakeUserContext : IUserContext
    {
        public FakeUserContext(string userId)
        {
            UserId = userId;
        }

        public string? UserId { get; }

        public bool IsAuthenticated => true;
    }

    private sealed class FakeVibeMessageRepository : IVibeMessageRepository
    {
        public List<VibeMessage> Messages { get; } = [];

        public Task<IReadOnlyCollection<VibeMessage>> GetAllAsync(CancellationToken cancellationToken)
        {
            IReadOnlyCollection<VibeMessage> messages = Messages;
            return Task.FromResult(messages);
        }

        public Task<VibeMessage> AddAsync(VibeMessage vibeMessage, CancellationToken cancellationToken)
        {
            Messages.Add(vibeMessage);
            return Task.FromResult(vibeMessage);
        }
    }
}