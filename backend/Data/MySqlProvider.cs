using Dapper;
using MySql.Data.MySqlClient;

namespace BackendApi.Data
{
    public class MySqlProvider : IDatabaseProvider
    {
        private readonly string _cs;
        public MySqlProvider(IConfiguration cfg)
        {
            _cs = cfg.GetConnectionString("MySqlConnection")
                  ?? throw new InvalidOperationException("Missing MySqlConnection");
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? param = null)
        {
            using var conn = new MySqlConnection(_cs);
            return await conn.QueryAsync<T>(sql, param);
        }

        public async Task<T?> QuerySingleOrDefaultAsync<T>(string sql, object? param = null)
        {
            using var conn = new MySqlConnection(_cs);
            return await conn.QuerySingleOrDefaultAsync<T>(sql, param);
        }

        public async Task<int> ExecuteAsync(string sql, object? param = null)
        {
            using var conn = new MySqlConnection(_cs);
            return await conn.ExecuteAsync(sql, param);
        }
    }
}
