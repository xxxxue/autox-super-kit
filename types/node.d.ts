export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            Node_Env: 'test' | 'dev' | 'prod';
        }
    }
}