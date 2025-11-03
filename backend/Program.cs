//backend/Program.cs
using BackendApi.Data;
using BackendApi.Services;
using System.Text.Json;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

// REGISTRAR TYPE HANDLERS ANTES DE CUALQUIER OTRO SERVICIO
SqlMapper.AddTypeHandler(new DateTimeHandler());
SqlMapper.AddTypeHandler(new NullableDateTimeHandler());

builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DB Provider (MySQL por appsettings) aqui estamos inyectando (registrando la di)la db que usaremos (ya que se uso una abstraccion para cambiar de proveedor de db sin afectar el modelo de datos)
//// Elegir provider por appsetting.json: "Database:Provider" => "MySql" | "SqlServer"
builder.Services.AddScoped<IDatabaseProvider, MySqlProvider>();

// Services de dominio
builder.Services.AddScoped<EquipoService>();
//config en puerto del frontend que usaremos
builder.Services.AddCors(o => o.AddPolicy("AllowFrontend",
    p => p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddScoped<DbHealthService>();
builder.Services.AddScoped<IReportesService, ReportesService>();



var app = builder.Build();

app.UseCors("AllowFrontend");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();
app.Run();