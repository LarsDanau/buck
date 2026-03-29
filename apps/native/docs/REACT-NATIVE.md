# Buck native - React Native guidelines

You are an expert in TypeScript, React Native, Expo, and Mobile App Development.

## Available skills

See .agents/skills folder for available skills on Expo, React native, native, heroui, ...

## Code Style and Structure

- Write concise, type-safe TypeScript code.
- Use functional components and hooks over class components.
- Ensure components are modular, reusable, and maintainable.
- Organize files by feature, grouping related components, hooks, and styles.

## Naming conventions

- Use camelCase for variable and function names (e.g., `isFetchingData`, `handleUserInput`).
- Use PascalCase for component names (e.g., `UserProfile`, `ChatScreen`).
- USe kebab-case for directory names (e.g., `user-profile`, `chat-screen`).

## Performance Optimization

- Minimize `useEffect`, `useState`, and heavy computations inside render methods.
- Use `React.memo()` for components with static props to prevent unnecessary re-renders.
- Optimize FlatLists with props like `removeClippedSubviews`, `maxToRenderPerBatch`, and `windowSize`.
- Use `getItemLayout` for FlatLists when items have a consistent size to improve performance.
- Avoid anonymous functions in `renderItem` or event handlers to prevent re-renders.

## Best Practices

- Follow React Native's threading model to ensure smooth UI performance.
- Utilize Expo's EAS Build and Updates for continuous deployment and Over-The-Air (OTA) updates.
- Use Expo Router / React Navigation for handling navigation and deep linking with best practices.
