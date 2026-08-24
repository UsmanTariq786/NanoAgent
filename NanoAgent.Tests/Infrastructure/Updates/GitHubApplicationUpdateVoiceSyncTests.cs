using FluentAssertions;
using NanoAgent.Application.Models;
using NanoAgent.Infrastructure.Secrets;
using NanoAgent.Infrastructure.Updates;
using NanoAgent.Tests.Infrastructure.Secrets.TestDoubles;

namespace NanoAgent.Tests.Infrastructure.Updates;

public sealed class GitHubApplicationUpdateVoiceSyncTests
{
    [Fact]
    public async Task InstallAsync_Should_RunInstaller_WhenCliIsCurrent_ToSynchronizeVoiceRuntime()
    {
        FakeProcessRunner processRunner = new();
        processRunner.EnqueueResult(new ProcessExecutionResult(0, string.Empty, string.Empty));
        GitHubApplicationUpdateService sut = new(new HttpClient(), processRunner);
        ApplicationUpdateInfo updateInfo = new(
            "1.2.3",
            "1.2.3",
            new Uri("https://github.com/getnanoai/NanoAgent/releases/latest"),
            IsUpdateAvailable: false);

        ApplicationUpdateInstallResult result = await sut.InstallAsync(
            updateInfo,
            progress: null,
            CancellationToken.None);

        ProcessExecutionRequest request = processRunner.Requests.Should().ContainSingle().Subject;
        request.EnvironmentVariables.Should().ContainKey("NanoAgent_TAG")
            .WhoseValue.Should().Be("1.2.3");
        result.IsSuccess.Should().BeTrue();
        result.Message.Should().Contain("Voice runtime synchronization");
    }
}
