using BackendApi.Data;
using BackendApi.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB Provider (MySQL por appsettings)
builder.Services.AddScoped<IDatabaseProvider, MySqlProvider>();

// Services de dominio
builder.Services.AddScoped<EquipoService>();

builder.Services.AddCors(o => o.AddPolicy("AllowFrontend",
    p => p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddScoped<DbHealthService>();


var app = builder.Build();

app.UseCors("AllowFrontend");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();
