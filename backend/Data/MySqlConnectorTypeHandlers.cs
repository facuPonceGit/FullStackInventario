using Dapper;
using MySqlConnector;
using System.Data;
//Este conector se implemento por error en facha traida de db y mostrada en back (solucionado)
namespace BackendApi.Data
{
    public class DateTimeHandler : SqlMapper.TypeHandler<DateTime>
    {
        public override void SetValue(IDbDataParameter parameter, DateTime value)
        {
            parameter.Value = value;
        }

        public override DateTime Parse(object value)
        {
            if (value is MySqlDateTime mySqlDateTime)
            {
                return mySqlDateTime.IsValidDateTime ? mySqlDateTime.GetDateTime() : DateTime.MinValue;
            }
            return (DateTime)value;
        }
    }

    public class NullableDateTimeHandler : SqlMapper.TypeHandler<DateTime?>
    {
        public override void SetValue(IDbDataParameter parameter, DateTime? value)
        {
            parameter.Value = value ?? (object)DBNull.Value;
        }

        public override DateTime? Parse(object value)
        {
            if (value == null || value is DBNull)
                return null;

            if (value is MySqlDateTime mySqlDateTime)
            {
                return mySqlDateTime.IsValidDateTime ? mySqlDateTime.GetDateTime() : null;
            }

            return (DateTime)value;
        }
    }
}