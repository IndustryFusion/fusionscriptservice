# fusionscriptservice
A gateway service that allows for scriptable logic

deno cache --lock=lock.json --lock-write deps.ts

deno cache --reload --lock=lock.json src/deps.ts

docker build --tag fusionscriptservice:latest .
