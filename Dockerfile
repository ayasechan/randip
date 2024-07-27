# build
FROM denoland/deno:alpine AS builder

WORKDIR /app

COPY . .

RUN deno cache main.ts

# runtime
FROM denoland/deno:alpine AS runtime

COPY --link --from=builder /app /app
COPY --link --from=builder /deno-dir /deno-dir

ENV PORT=8080
EXPOSE 8080
WORKDIR /app

CMD ["deno", "run", "-A", "main.ts"]