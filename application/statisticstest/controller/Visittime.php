<?php
namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use think\Db;
//use app\common\Token;

class Visittime{
    //VisitTime.getVisitInformationPerLocalTime ,日报表
    public function get_VisitTime_getVisitInformationPerLocalTime() {
        //设置默认天数
        $now_time = time();
        $today_time = date("Y-m-d", $now_time);
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
            $entity_param['method'] = 'VisitTime.getVisitInformationPerLocalTime'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                foreach ($getData_message['data'] as $kkk => $vvvv) {
                    $temp = [];
                    $temp['label'] = intval($vvvv['label']); //时间 小时
                    $temp['nb_visits'] = $vvvv['nb_visits']; // 访问数量
                   // $temp['nb_actions'] = intval($vvvv['nb_actions']); //活动数量 即pv
                    $getData_message['data'][$kkk] = $temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'get visittime is success',
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





}