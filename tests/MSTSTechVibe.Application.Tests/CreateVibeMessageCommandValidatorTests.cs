using FluentValidation.TestHelper;
using MSTSTechVibe.Application.Features.VibeMessages.Commands.CreateVibeMessage;

namespace MSTSTechVibe.Application.Tests;

public sealed class CreateVibeMessageCommandValidatorTests
{
    [Fact]
    public void Validate_ShouldFail_WhenTitleIsMissing()
    {
        var validator = new CreateVibeMessageCommandValidator();
        var command = new CreateVibeMessageCommand(string.Empty, "A valid description.");

        var result = validator.TestValidate(command);

        result.ShouldHaveValidationErrorFor(model => model.Title);
    }
}