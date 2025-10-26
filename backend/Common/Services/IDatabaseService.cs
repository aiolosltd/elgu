using System.Data;

namespace BusinessPermitAPI.Common.Services;

public interface IDatabaseService
{
    Task<IEnumerable<T>> QueryAsync<T>(string sql, object? parameters = null);
    Task<T> QuerySingleAsync<T>(string sql, object? parameters = null);
    Task<T> QueryFirstAsync<T>(string sql, object? parameters = null);
    Task<int> ExecuteAsync(string sql, object? parameters = null);
    Task<object> ExecuteScalarAsync(string sql, object? parameters = null);
    IDbConnection GetConnection();
}