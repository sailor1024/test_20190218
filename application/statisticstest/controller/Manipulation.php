<?php

namespace app\statisticstest\controller;
use app\statisticstest\model\ItemsIpVisit;
use think\Request;
use think\Controller;
use think\Validate;
use think\Db;
use app\common\Token;
use app\statisticstest\validate\ItemsIpVisit as ValidateVisit;

Class Manipulation extends Controller {
	/*
    * 获取IP（来源于网络）
    *
    * @return string
    *
    *
    **
    */
	protected function getClientIpTwo() {
		if (getenv("HTTP_CLIENT_IP")) {
			$ip = getenv("HTTP_CLIENT_IP");
		} elseif (getenv("HTTP_X_FORWARDED_FOR")) {
			$ip = getenv("HTTP_X_FORWARDED_FOR");
		} elseif (getenv("REMOTE_ADDR")) {
			$ip = getenv("REMOTE_ADDR");
		} else { 
		 	$ip = 0; 
		} 

		return $ip;
	}

  /*
   * 获取IP（来源于网络）
   *
   * $return string
   */
	protected function getClientIp(){
		$request = Request::instance();
		$ip = $request->ip();
		return $ip;
	}
	/*	
	* 添加项目的IP浏览量
    *
	* @author TD 20190313
	* @param   items_dirname              项目的路径名
    * @return     array    code           状态码
    * @return     array   message         信息
    * @return     array    data           返回的数据 
    *
	*/
	public function addVisitorIp() {
		$items_dirname = input('param.items_dirname');
		$msg = array('code' => 416, 'message' => 'items_dirname参数缺失', 'data'=>array());
		if (empty($items_dirname)) return  json($msg);
        $ip = $this->getClientIp();   
        $this->data['client_ip'] = $ip;
        //验证字段
        $validate = new ValidateVisit();
        $array['items_dirname'] = $items_dirname;
        $array['client_ip'] = $ip;

        if (!$validate->check( $array)) {  
             $arr['code'] = 405;
             $arr['message'] = $validate->getError();
             $arr['data'] = array();   
       		return json($arr);
        }  

        //添加进库
        try{   
	        $models = new ItemsIpVisit();
	        $models->client_ip = $ip;
	        $models->items_dirname = $items_dirname;
	        $result = $models->save();
    	} catch (\Exception $e) {
    	//	Log::write( 'module:statistics,controller:ManipulationData,action:visitorSum,parameter: items_dirname='.$array['items_dirname'].' & client_ip='.$ip.'.','notice');
    		$result === false;
    	}
    	
    	//返回信息
        if ($result !== false) {
        	return json(['code'=>200, 'message'=>'浏览纪录添加成功', 'data'=>array()]);
        }else{
        	return json(['code'=>500, 'message'=>'浏览纪录添加失败', 'data'=>array()]);
        }
		
	}//addVisitorIp

	/*
	 * 返回项目的IP浏览量
     *
	 * @author TD 20190313
	 * @parameter  get_data_type         string       items|user|company  数据类型
     * @parameter  items_dirname         string       项目路径名 当get_data_type = items时必须
     * @return     array    code                      状态码
     * @return     array   message                    信息
     * @return     array    data                      返回的数据 
     * @return     array  data/today_sum   int        今天的浏览量
     * @return     array  data/ rate      string      与昨天对比的比率 
	 * history  TD 20190315 edit 增加查找 user_id comany_id的功能
	 */
public function visitorIpSum() {
	 	try{
		 	$param = input('param.');
		 	$type = isset($param['get_data_type'])?$param['get_data_type']:'items';
		 	$dirname = isset($param['items_dirname'])?$param['items_dirname']:'';
		 	$token = isset($param['_'])?$param['_']:'';
		 	//参数检查
		 	if ($type == 'company' || $type == 'user') {
		 		$tokenData = Token::getUserGreps(['key_name' => $token]);

	                if( !isset($tokenData['user_id']) || !isset($tokenData['company_id']) ){
	                    $data['code'] = 401 ;
	                    $data['message'] = 'token无效';
	                    $data['data'] = array();
	                }

	                $array['user_id'] = $tokenData['user_id'];
	                $array['company_id'] = $tokenData['company_id'];
	                
                    if ($type == 'company') unset($array['user_id']);
	                
                    if ($type == 'user') unset($array['company_id']);

		 	} else {
		 	
            	    if (empty( $dirname)) {
		 		    	$data['code'] = 416 ;
	                    $data['message'] = '参数缺失或参数不正确';
	                    $data['data'] = array();
		 		    }
		 		     $array['items_dirname'] = $dirname;

		 	}

			if (isset($data)) return  $data ;

	        //验证参数格式
			$validate = new ValidateVisit();

	        if( !$validate -> check( $array ) ){
	        	$data = [
	        		'code' => 204 ,
	        		'message' => $validate -> getError(),
	        		'data' => array(),
	        	];
	       		return  $data;
	        }

	        //获取两天数据
             $time = time();
	         $today = intval(date('Ymd', $time));
             $timeTwo = $time - 60 * 60 * 24 ;
             $yesterday = intval(date('Ymd', $timeTwo));

	         $data = Db::table('items_ip_visit')->where($array)->where('date', 'IN', "$yesterday , $today")->column('id,date,client_ip');

	         foreach ($data as $k => $v) {
				$result[$v['date']][] = $v['date'] ;
	         }

	         //计算当天总数 及 与昨天相比较的比率
	         //直接线上测试，这个接口已经改到爆炸了，没有事先讲明需求，然后一改再改，数据结构会失控
	          $result[$today] = isset($result[$today])?$result[$today]:0;

	          if ($result[$today] == 0) {
	          	 return ['code' => 200, 'message' => '获取成功', 'data' => array('today_sum' => 0 ,'rate' =>'0.00%' )];
	          }

	          $today_sum = count($result[$today], 1);
	          $result[$yesterday] = isset($result[$yesterday])?$result[$yesterday]:0;
	          $yesterday_sum = count( $result[$yesterday], 1 );
	          // 当today_sum 为0时的计算逻辑（除数不能为0）
             $rate = ( $today_sum - $yesterday_sum ) / $today_sum * 100;
	          $rate = sprintf("%.2f", $rate) . '%';
	          $a =  ['code' => 200, 'message' => '获取成功', 'data' => array('today_sum' => $today_sum, 'rate' => $rate)];
	          return  $a;
       } catch (\Exception $e) {
       	$a=['code' => 204 , 'message' =>$e ->getMessage() , 'data' => array('today_sum' => 0 ,'rate' =>'0%' )];
     	 return  $a;
     }
	 }//visitorIpSum


//     /**
//      * 返回项目的IP浏览量
//      * @return array
//      */
//     public function visitorIpSum()
//     {
// 		$type = input('get_data_type', 'items');
// 		$dirname = input('items_dirname', '');
// 		$token = input('_', '');
//         if ($type == 'company' || $type == 'user') {
//             //用于跳过token验证
// //            $tokenData['user_id'] = '5bd99edd113ce';
// //            $tokenData['company_id'] = '1';
//             $tokenData = Token::getUserGreps(['key_name' => $token]);
//             if ($tokenData['user_id'] && $tokenData['company_id']) {
//                 if ($type == 'company') {
//                     $array['company_id'] = $tokenData['company_id'];
//                 } else {
//                     $array['user_id'] = $tokenData['user_id'];
//                 }
//             } else {
//                 return ['code' => 401 , 'message' => 'token无效'];
//             }
//         } elseif($type == 'items' && $dirname) {
//             $array['items_dirname'] = $dirname;
//         } else {
//             return ['code' => 416 , 'message' => '参数缺失或参数不正确'];
//         }

//         //获取两天数据
//         $today = intval(date('Ymd', time()));
//         $yesterday = $today - 1;
//         $data = Db::table('items_ip_visit')->where($array)
//             ->where('date', 'IN', "$yesterday , $today")->column('id,date,client_ip');
//         foreach ($data as $k => $v) {
//             $result[$v['date']][] = $v['date'];
//         }

//         //计算当天总数 及 与昨天相比较的比率
//         if (!$result[$today]) {
//             return ['code' => 200 , 'message' => 'success', 'data' =>['today_sum' => 0, 'rate' => '0%'] ];
//         }
//         $today_sum = count($result[$today], 1);
//         $result[$yesterday] = $result[$yesterday] ?: 0;
//         $yesterday_sum = count($result[$yesterday], 1);
//         // 当today_sum 为0时的计算逻辑（除数不能为0）
//         $rate = ($today_sum - $yesterday_sum) / $today_sum * 100;
//         $rate = sprintf("%.2f", $rate) . '%';

//         return ['code' => 200 , 'message' => 'success', 'data' =>['today_sum' => $today_sum, 'rate' => $rate] ];
//     }

}