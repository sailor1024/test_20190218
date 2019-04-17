<?php
namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use think\Db;
//use app\common\Token;

class Loyalty
{

    //老访客 本周数据
    public function get_VisitFrequency_get(){

        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time  );
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天


        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');
           
           // if(empty($entity_param['date'])){
                $get_date_time = com_this_week_time(time());
            
                $entity_param['date'] = $get_date_time['monday_time_date'] .','. $get_date_time['sunday_time_date'];
               
          //  }
            
            $entity_param['method'] = 'VisitFrequency.get'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $one_week_data = [];
                foreach($getData_message['data'] as $kkk=>$vvvv){
                   
                    if(empty($vvvv['nb_uniq_visitors_returning'])){
                        $vvvv['nb_uniq_visitors_returning'] = 0; 
                    }
                   $one_week_data[$kkk]['nb_uniq_visitors_returning'] = $vvvv['nb_uniq_visitors_returning']; // 老访客 
                   
                   
                }
              
                $returnData_message['data']['one_week_data'] = $one_week_data; 
                $returnData_message['data']['now_time_date'] =  $get_date_time['now_time_date']; //今天日期 2018-01-01
                $returnData_message['data']['week_day'] =  $get_date_time['week_day']; //本周几
                

                $return_data = array(
                    'data' => $returnData_message['data'],
                    'message' => '老访客',
                    'code'=> 200,
                );
            }else{
                throw new \Exception($getData_message['message']);
            }


            

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        return $return_data ;
         
    }

    //老访客访问的次数
    public function get_VisitorInterest_getNumberOfVisitsByVisitCount(){

        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time  );
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天


        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');
           
            if(empty($entity_param['date'])){
                $entity_param['date'] = $today_time;
               
            }
            
            $entity_param['method'] = 'VisitorInterest.getNumberOfVisitsByVisitCount'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            /*
            原来数据：
                1
                2
                3
                4
                5
                6
                7
                8
                9~14
                15~25
                26~50
                51~100
                101~200
                201+

                改为：

                    1
                    2~3
                    4~8
                    9~25
                    26~50
                    51~100
                    101~200
                    201+ 
             */
              $newData = $getData_message['data'];

              $array[0]['label'] =  '1 次访问';
              $array[1]['label'] =  '2~3 次访问';
              $array[2]['label'] =  '4~8 次访问';
              $array[3]['label'] =  '9~25 次访问';
              $array[4]['label'] =  '26~50 次访问';
              $array[5]['label'] =  '51~100 次访问';
              $array[6]['label'] =  '101~200 次访问';
              $array[7]['label'] =  '201+ 次访问';

              $array[0]['nb_visits'] =  $newData[0]['nb_visits'];
              $array[1]['nb_visits'] =  $newData[1]['nb_visits']+$newData[2]['nb_visits'];
              $array[2]['nb_visits'] =  $newData[3]['nb_visits']+$newData[4]['nb_visits']+$newData[5]['nb_visits']+$newData[6]['nb_visits']+$newData[7]['nb_visits'];
              $array[3]['nb_visits'] =  $newData[8]['nb_visits']+$newData[9]['nb_visits'];
              $array[4]['nb_visits'] =  $newData[10]['nb_visits'];
              $array[5]['nb_visits'] =  $newData[11]['nb_visits'];
              $array[6]['nb_visits'] =  $newData[12]['nb_visits'];
              $array[7]['nb_visits'] =  $newData[13]['nb_visits'];
            
              $amount = 0;
              foreach ($array as $k => $v) {
                 $amount = $array[$k]['nb_visits'] + $amount;
              };

              if( $amount == 0){ $amount = 1;};

              foreach ($array as $kk => $vv) {
                    $rate = $array[$kk]['nb_visits'] / $amount*100;
                    $rate = sprintf("%.2f", $rate);
                    $array[$kk]['nb_visits_percentage'] = $rate.'%';
              };
            $getData_message['data'] = null;
            $getData_message['data'] = $array;

            if($getData_message['code'] == 200){
                
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => '老访客的访问次数',
                    'code'=> 200,
                );
            }else{
                throw new \Exception($getData_message['message']);
            }


            

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        return $return_data ;
        
    }





  




     //停留时间段访问的次数 0~30秒，30~1分钟
     public function get_VisitorInterest_getNumberOfVisitsPerVisitDuration(){

        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time  );
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天


        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');
           
            if(empty($entity_param['date'])){
                $entity_param['date'] = $today_time;
               
            }
            
            $entity_param['method'] = 'VisitorInterest.getNumberOfVisitsPerVisitDuration'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => '停留时间段',
                    'code'=> 200,
                );
            }else{
                throw new \Exception($getData_message['message']);
            }


            

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        return $return_data ;
         
    }

     //浏览页面访问的次数
     public function get_VisitorInterest_getNumberOfVisitsPerPage(){

        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time  );
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天


        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{

            $entity_param = input('param.');
           
            if(empty($entity_param['date'])){
                $entity_param['date'] = $today_time;
               
            }
            
            $entity_param['method'] = 'VisitorInterest.getNumberOfVisitsPerPage'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => '浏览页面',
                    'code'=> 200,
                );
            }else{
                throw new \Exception($getData_message['message']);
            }


            

        }catch(\Exception $e){
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }

        return $return_data ;
       
    }

     


}