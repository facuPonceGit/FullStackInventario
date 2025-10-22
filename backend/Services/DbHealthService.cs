// Services/DbHealthService.cs
using BackendApi.Data;

namespace BackendApi.Services
{
    public class DbHealthService
    {
        private readonly IDatabaseProvider _db;
        public DbHealthService(IDatabaseProvider db) => _db = db;

        public async Task<object> PingAsync()
        {
            var version = await _db.QuerySingleOrDefaultAsync<string>("SELECT VERSION();");
            var now = await _db.QuerySingleOrDefaultAsync<DateTime>("SELECT NOW();");
            var who = await _db.QuerySingleOrDefaultAsync<string>("SELECT USER();");
            var dbname = await _db.QuerySingleOrDefaultAsync<string>("SELECT DATABASE();");
            return new { ok = true, who, dbname, version, now };
        }
    }
}
