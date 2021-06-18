# fusionscriptservice
A gateway service that allows for scriptable logic

# Dependency Lifecycle
## Add dependency
Just add to app/deps.ts

## Update lock files
```
deno cache --lock-write --lock=app/lock.json app/deps.ts
```

## Download dependencies to local cache
```
deno cache --reload --lock=app/lock.json app/deps.ts
```

# Docker Build
```
docker build --tag fusionscriptservice:latest .
```
