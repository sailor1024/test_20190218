<?php

namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use app\common\Token;

class Browser {
    public function index(){

    }

    /* public $Browser_method_all = [ //方法的简介
        
        'class' => 'Browser',
        'method_array' =>[
            'get_DevicesDetection_getOsVersions' => '获取操作系统版本' ,
            'get_DevicesDetection_getBrowsers' => '获取浏览器名称',
            'get_DevicesDetection_getBrowserEngines' => '获取浏览器引擎',
            'get_DevicePlugins_getPlugin' => '获取浏览器插件',
            'get_Resolution_getConfiguration' => '客户端配置 （分辨率与型号） 本周数据',
            
        ],
    ]; */

     
    //获取操作系统 window android ios mac（暂时没有使用）
    /* public function get_DevicesDetection_getOsFamilies(){

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
            
            $entity_param['method'] = 'DevicesDetection.getOsFamilies'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => '获取操作系统',
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

        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
        exit;
    } */

    //获取操作系统版本 window10 windows7  android9  ios10 mac
    public function get_DevicesDetection_getOsVersions(){

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
            
            $entity_param['method'] = 'DevicesDetection.getOsVersions'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $temp_return_data = [];
                foreach($getData_message['data']  as $kkk => $vvv){
                    $temp_return_data[$kkk]['nb_uniq_visitors']  = $vvv['nb_uniq_visitors']; //访客数
                    $temp_return_data[$kkk]['label']  = $vvv['label']; //操作系统版本
                    
                }


                $return_data = array(
                    'data' => $temp_return_data,
                    'message' => '获取操作系统版本',
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

    //获取浏览器名称
    public function get_DevicesDetection_getBrowsers(){

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
            
            $entity_param['method'] = 'DevicesDetection.getBrowsers'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $temp_return_data = [];
                foreach($getData_message['data']  as $kkk => $vvv){
                    $temp_return_data[$kkk]['nb_uniq_visitors']  = $vvv['nb_uniq_visitors']; //访客数
                    $temp_return_data[$kkk]['label']  = $vvv['label']; //浏览器名称
                    
                }

                $return_data = array(
                    'data' => $temp_return_data,
                    'message' => '获取浏览器',
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

    //获取浏览器引擎
    public function get_DevicesDetection_getBrowserEngines(){

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
            
            $entity_param['method'] = 'DevicesDetection.getBrowserEngines'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $temp_return_data = [];
                foreach($getData_message['data']  as $kkk => $vvv){
                    $temp_return_data[$kkk]['nb_uniq_visitors']  = $vvv['nb_uniq_visitors']; //访客数
                    $temp_return_data[$kkk]['label']  = $vvv['label']; //浏览器引擎名称
                    
                }
                $return_data = array(
                    'data' => $temp_return_data,
                    'message' => '获取浏览器引擎',
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




    //获取浏览器插件
    public function get_DevicePlugins_getPlugin(){

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
            
            $entity_param['method'] = 'DevicePlugins.getPlugin'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $temp_return_data = [];
                foreach($getData_message['data']  as $kkk => $vvv){
                    $temp_return_data[$kkk]['nb_visits']  = $vvv['nb_visits']; //访问数
                    $temp_return_data[$kkk]['label']  = $vvv['label']; //浏览器插件名称
                    
                }
                $return_data = array(
                    'data' => $temp_return_data ,
                    'message' => '获取浏览器插件',
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

    //客户端配置 （分辨率与型号） 本周数据
    public function get_Resolution_getConfiguration(){

        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time );
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
            
            $entity_param['method'] = 'Resolution.getConfiguration'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $one_week_data = [];
                foreach($getData_message['data'] as $kkk=>$vvvv_date){
                    $one_week_data[$kkk] = [];
                    $one_week_data[$kkk]['data'] = []; //
                   foreach( $vvvv_date as  $kk_2 =>$vv_2){  
                       // $one_week_data[$kkk][$kk_2]['nb_uniq_visitors'] = $vv_2['nb_uniq_visitors']; //  访客量
                        //$one_week_data[$kkk][$kk_2]['label'] = $vv_2['label']; //  设备分辨率
                        //处理label 将 Windows / Chrome / 1920x1080 处理成 Windows/1920x1080 
                        $temp_deal_label_arr = explode('/', $vv_2['label']); // ["Windows ", " Chrome ", "  1920x1080"]
                       
                        foreach($temp_deal_label_arr as $kkkkk => $ttttt){ //去掉左右空格
                            $temp_deal_label_arr[$kkkkk] = trim($temp_deal_label_arr[$kkkkk]); //["Windows", "Chrome", "1920x1080"]
                            
                        }
                        unset($temp_deal_label_arr[(count($temp_deal_label_arr))-2]); //["Windows","1920x1080"]
                        $temp_label_string = implode('/',$temp_deal_label_arr); // 'Windows/1920x1080'
                        //$one_week_data[$kkk][$kk_2]['temp_deal_label_arr'] = $temp_label_string ;   

                        if(empty( $one_week_data[$kkk]['data'][$temp_label_string] ) ){
                            $one_week_data[$kkk]['data'][$temp_label_string] = intval($vv_2['nb_uniq_visitors']);
                            
                        }else{
                            $one_week_data[$kkk]['data'][$temp_label_string] += intval($vv_2['nb_uniq_visitors']);
                        }
                        
                       
                   }

                   $temp_ds234fsdfsdf = $one_week_data[$kkk]['data'];
                   
                   $one_week_data[$kkk] = [];
                   foreach(  $temp_ds234fsdfsdf as $k_label => $v_uniq_visit){
                        $tempsdf = [];
                        $tempsdf['label'] =  $k_label;
                        $tempsdf['nb_uniq_visitors'] =  $v_uniq_visit;
                        $one_week_data[$kkk][] = $tempsdf;
                        
                   }
                   if(!empty($one_week_data[$kkk])){
                        //nb_uniq_visitors  进行降序排列
                        $nb_uniq_visitors = array_column($one_week_data[$kkk],'nb_uniq_visitors');
                        array_multisort($nb_uniq_visitors,SORT_DESC,$one_week_data[$kkk]);
                   }
                                     
                }
              
                //$returnData_message['data']['one_week_data'] = $one_week_data; 
                //添加当周的默认数据信息
                $get_change_data = com_one_week_data_all_type_list( $one_week_data , 'label' , 'nb_uniq_visitors' );
                if($get_change_data['code'] !== 0){ //一般不会
                    throw new \Exception($get_change_data['message']);           
                }
                $returnData_message['data'] = $get_change_data['data'] ; 


                $returnData_message['data']['now_time_date'] =  $get_date_time['now_time_date']; //今天日期 2018-01-01
                $returnData_message['data']['week_day'] =  $get_date_time['week_day']; //本周几
                

                $return_data = array(
                    'data' => $returnData_message['data'],
                    'message' => '客户端配置',
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