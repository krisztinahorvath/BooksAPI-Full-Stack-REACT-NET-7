using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.WebSockets;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using System.Text;

namespace Lab3BookAPI.Controllers
{
    namespace ChatApp
    {
        public class WebSocketMiddleware
        {
            private readonly RequestDelegate _next;
            private readonly List<WebSocket> _sockets;

            public WebSocketMiddleware(RequestDelegate next)
            {
                _next = next;
                _sockets = new List<WebSocket>();
            }

            public async Task Invoke(HttpContext context)
            {
                if (context.WebSockets.IsWebSocketRequest)
                {
                    CancellationToken ct = context.RequestAborted;
                    WebSocket webSocket = await context.WebSockets.AcceptWebSocketAsync();
                    _sockets.Add(webSocket);

                    while (webSocket.State == WebSocketState.Open)
                    {
                        // Receive incoming messages from the WebSocket
                        var buffer = new byte[1024 * 4];
                        WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), ct);

                        if (result.MessageType == WebSocketMessageType.Text)
                        {
                            // Broadcast the message to all connected clients
                            string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                            foreach (var socket in _sockets)
                            {
                                await socket.SendAsync(new ArraySegment<byte>(buffer, 0, result.Count), WebSocketMessageType.Text, true, ct);
                            }
                        }
                        else if (result.MessageType == WebSocketMessageType.Close)
                        {
                            // Remove the WebSocket from the list of connected clients
                            _sockets.Remove(webSocket);
                            break;
                        }
                    }
                }
                else
                {
                    await _next(context);
                }
            }
        }

        public static class WebSocketExtensions
        {
            public static IApplicationBuilder UseWebSocketMiddleware(this IApplicationBuilder app)
            {
                return app.UseMiddleware<WebSocketMiddleware>();
            }
        }
    }
}
