FROM golang:alpine AS builder
WORKDIR /app
COPY go.mod ./
# RUN go mod download # Uncomment when dependencies are added
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o worker .

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/worker .
CMD ["./worker"]
