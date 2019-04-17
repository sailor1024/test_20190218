<?php
namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use think\Db;
//use app\common\Token;

class Language
{
    //浏览器语言
    public function get_UserLanguage_getLanguage() {
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
            $entity_param['method'] = 'UserLanguage.getLanguage'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);
            if ($getData_message['code'] == 200) {
                $all_nb_visits = 0;//访问总量
                foreach ($getData_message['data'] as $kkk => $vvvv) {
                    $temp = [];
                    $temp['label'] = $vvvv['label']; //访问语言
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量
                    $all_nb_visits += intval($vvvv['nb_visits']); //累加访问总数
                    $getData_message['data'][$kkk] = $temp;
                }
                foreach ($getData_message['data'] as $kkk => $vvvv) { //只要可以进去，访问总量一定大于0，所以不用考虑分母为 0
                    $temp_visite_rate = (intval($vvvv['nb_visits'])) / $all_nb_visits; // 访问量除以总量
                    $temp_visite_rate = round(($temp_visite_rate * 100), 2) . '%';
                    $getData_message['data'][$kkk]['nb_visits_rate'] = $temp_visite_rate;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getLanguage is success',
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

    

}