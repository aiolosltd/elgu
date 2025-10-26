using Dapper;
using MySqlConnector;
using System.Data;

namespace BusinessPermitAPI.Common.Services;

public class DatabaseService : IDatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new ArgumentNullException("Connection string is missing");
    }

    public IDbConnection GetConnection()
    {
        return new MySqlConnection(_connectionString);
    }

    public async Task<IEnumerable<T>> QueryAsync<T>(string sql, object? parameters = null)
    {
        using var connection = GetConnection();
        return await connection.QueryAsync<T>(sql, parameters);
    }

    public async Task<T> QuerySingleAsync<T>(string sql, object? parameters = null)
    {
        using var connection = GetConnection();
        return await connection.QuerySingleOrDefaultAsync<T>(sql, parameters);
    }

    public async Task<int> ExecuteAsync(string sql, object? parameters = null)
    {
        using var connection = GetConnection();
        return await connection.ExecuteAsync(sql, parameters);
    }

    // Additional useful methods
    public async Task<T> QueryFirstAsync<T>(string sql, object? parameters = null)
    {
        using var connection = GetConnection();
        return await connection.QueryFirstOrDefaultAsync<T>(sql, parameters);
    }

    public async Task<object> ExecuteScalarAsync(string sql, object? parameters = null)
    {
        using var connection = GetConnection();
        return await connection.ExecuteScalarAsync(sql, parameters);
    }
}