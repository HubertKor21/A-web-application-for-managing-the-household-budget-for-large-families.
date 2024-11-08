
import OrdersTable from '../Component/OrdersTable';
import SalesChart from '../Component/SalesChart';
import StatCards from '../Component/StatCards';

function Home() {
  return (
    <div>
      <StatCards/>
      <OrdersTable/>
      <SalesChart/>
    </div>
  );
}

export default Home;
