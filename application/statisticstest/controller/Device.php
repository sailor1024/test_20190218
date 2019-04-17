<?php
namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use app\common\Token;


class Device {
    //获取设备类型
    public function get_DevicesDetection_getType() {
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time);
        $yesterday_time = date("Y-m-d",($now_time - 60*60*24)); //昨天
        $return_data = array(
            'data' => [],
            'message' => '',
            'code' => 201,
        );
        try {
            $entity_param = input('param.');
            $get_date_time = com_this_week_time(time());
            $entity_param['date'] = $get_date_time['monday_time_date'] .','. $get_date_time['sunday_time_date']; //一周的数据
            $entity_param['method'] = 'DevicesDetection.getType'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                $one_week_data = [];
                foreach ($getData_message['data'] as $kkk => $vvv) {
                    $one_week_data[$kkk] = [];
                    foreach ($vvv as $key => $value) {
                        $one_week_data[$kkk][$key]['label'] =  $value['label']; //提示信息 ，智能手机，平板电脑
                        $one_week_data[$kkk][$key]['nb_visits'] =  $value['nb_visits']; //访问
                    }
                }

                //$returnData_message['data']['one_week_data'] = $one_week_data;
                //添加当周的默认数据信息
                $get_change_data = com_one_week_data_all_type_list( $one_week_data , 'label' , 'nb_visits' );
                if($get_change_data['code'] !== 0){ //一般不会
                    throw new \Exception($get_change_data['message']);           
                }
                $returnData_message['data'] = $get_change_data['data'] ; 
                
                $returnData_message['data']['now_time_date'] =  $get_date_time['now_time_date']; //今天日期 2018-01-01
                $returnData_message['data']['week_day'] =  $get_date_time['week_day']; //本周几
                $return_data = array(
                    'data' => $returnData_message['data'],
                    'message' => 'getType success',
                    'code'=> 200,
                );
            } else {
                throw new \Exception($getData_message['message']);
            }
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }
        return $return_data ;
    }

    //获取设备型号
    public function get_DevicesDetection_getModel() {
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
            if (empty($entity_param['date'])) {
                $entity_param['date'] = $today_time;
            }
            $entity_param['method'] = 'DevicesDetection.getModel'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                foreach ($getData_message['data'] as $kkk=>$vvv) {
                    $temp = [];
                    $temp['label'] = $vvv['label'];
                    $temp['nb_visits'] = $vvv['nb_visits'];
                    $getData_message['data'][$kkk] = $temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getModel success',
                    'code'=> 200,
                );
            } else {
                throw new \Exception($getData_message['message']);
            }
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }
        return $return_data;
    }

    //获取设备品牌
    public function get_DevicesDetection_getBrand() {
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time);
        $yesterday_time = date("Y-m-d", ($now_time - 60*60*24)); //昨天
        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );
        try{
            $entity_param = input('param.');
            if (empty($entity_param['date'])) {
                $entity_param['date'] = $today_time;
            }
            $entity_param['method'] = 'DevicesDetection.getBrand'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                foreach($getData_message['data'] as $kkk => $vvv) { //重新过滤输出
                    $temp = [];
                    $temp['label'] = $vvv['label'];
                    $temp['nb_visits'] = $vvv['nb_visits'];
                    $getData_message['data'][$kkk] = $temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getBrand success',
                    'code'=> 200,
                );
            } else {
                throw new \Exception($getData_message['message']);
            }
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }
        return $return_data ;
    }
    //获取设备分辨率 本周数据
    public function get_Resolution_getResolution() {
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time);
        $yesterday_time = date("Y-m-d", ($now_time - 60*60*24)); //昨天
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
            $entity_param['method'] = 'Resolution.getResolution'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                $one_week_data = [];
                foreach ($getData_message['data'] as $kkk => $vvvv) {
                    $one_week_data[$kkk] = [];
                   foreach ($vvvv as  $kk_2 => $vv_2) {
                        $one_week_data[$kkk][$kk_2]['nb_uniq_visitors'] = $vv_2['nb_uniq_visitors']; //  访客量
                        $one_week_data[$kkk][$kk_2]['label'] = $vv_2['label']; //  设备分辨率
                   }
                }
                
                //$returnData_message['data']['one_week_data'] = $one_week_data;
                //添加当周的默认数据信息
                $get_change_data = com_one_week_data_all_type_list( $one_week_data , 'label' , 'nb_uniq_visitors' );
                if($get_change_data['code'] !== 0){ //一般不会
                    throw new \Exception($get_change_data['message']);           
                }
                $returnData_message['data'] = $get_change_data['data'] ; 

                $returnData_message['data']['now_time_date'] = $get_date_time['now_time_date']; //今天日期 2018-01-01
                $returnData_message['data']['week_day'] = $get_date_time['week_day']; //本周几
                $return_data = array(
                    'data' => $returnData_message['data'],
                    'message' => '获取画面分辨率',
                    'code' => 200,
                );
            } else {
                throw new \Exception($getData_message['message']);
            }
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }
        return $return_data ;
    }


    
}