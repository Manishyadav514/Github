import CountUp from 'react-countup';
import { Col, Row, Statistic } from 'antd';


const formatter = (value) => <CountUp end={value} separator="," />;

function dpowercons (props) {
    

 return(
  
  
 <div className='mt-7 text-sm'>
  <Row gutter={16}>
    <Col span={12}>
      <Statistic title={props.title} value={45} formatter={formatter} />
    </Col>
    <Col span={12}>
      <Statistic title="Time Duration (ON)" value={112893} precision={2} formatter={formatter} />
    </Col>
  </Row>
  </div>
  
 )
 };

export default dpowercons
