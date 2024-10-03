import {
    DockerComposeEnvironment,
    StartedDockerComposeEnvironment,
} from "testcontainers";
import path from "path";

let instance: StartedDockerComposeEnvironment | null = null;

export const startDocker = async () => {
    const composeFilePath = path.resolve(__dirname);
    const composeFile = "docker-compose.yml";

    instance = await new DockerComposeEnvironment(
        composeFilePath,
        composeFile
    ).up();

    console.log("🐳 Docker running");
};

export const stopDocker = async () => {
    if (!instance) return;
    try {
        await instance.down();
        instance = null;
        console.log("🐳 Docker is sleeping");
    } catch (error) {
        console.log("🚫 Fail stopping Docker", { error });
    }
};

export const getInstanceDocker = () => {
    if (!instance) throw new Error("Docker is not running");
    return instance;
};
