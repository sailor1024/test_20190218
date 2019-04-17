<?php
namespace app\statisticstest\controller;

use app\statisticstest\controller\Data;
//use app\common\Token;
/*
    访问所在地
*/
class Location{
    public function index(){

    }

    //获取大洲的访问数据
    public function get_UserCountry_getContinent(){
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
            
            $entity_param['method'] = 'UserCountry.getContinent'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){
                $all_nb_visits = 0 ;//访问总量
                foreach($getData_message['data'] as $kkk=>$vvvv){
                    $temp = [];
                    
                    $temp['label'] =$vvvv['label']; //访问的大洲
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量
                    $all_nb_visits += intval($vvvv['nb_visits']); //累加访问总数

                   
                    $getData_message['data'][$kkk] =$temp;
                }
                //设置访问比率
                foreach($getData_message['data'] as $kkk=>$vvvv){ //只要可以进去，访问总量一定大于0，所以不用考虑分母为 0
                    $temp_visite_rate = (intval($vvvv['nb_visits']) ) / $all_nb_visits ; // 访问量除以总量
                    $temp_visite_rate = round( ($temp_visite_rate * 100) , 2 ) . '%';
                    $getData_message['data'][$kkk]['nb_visits_rate'] =$temp_visite_rate; 
                } 


                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getContinent is success',
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

    //获取国家的访问数据
    public function get_UserCountry_getCountry(){
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
            
            $entity_param['method'] = 'UserCountry.getCountry'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){

                foreach($getData_message['data'] as $kkk=>$vvvv){
                    $temp = [];
                    
                    $temp['label'] =$vvvv['label']; //访问国家
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量
                   // $temp['nb_actions'] = intval($vvvv['nb_actions']); //活动数量 即pv

                   
                    $getData_message['data'][$kkk] =$temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getCountry is success',
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

    //获取国家的省份的访问数据
    public function get_UserCountry_getRegion(){ 
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
            
            $entity_param['method'] = 'UserCountry.getRegion'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){

                foreach($getData_message['data'] as $kkk=>$vvvv){
                    $temp = [];
                    
                    $temp['label'] =$vvvv['label']; //访问国家等省份 guangdong,中国
                    $temp['country_name'] =$vvvv['country_name']; //访问国家的名称 ，中国
                   // $temp['region_name'] =$vvvv['region_name']; //访问国家的省份名称 ，guangdong
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量
                   // $temp['nb_actions'] = intval($vvvv['nb_actions']); //活动数量 即pv
                    $regionName =ucfirst($vvvv['region_name']);
                    $tempRegionName = db('region')->where('region_name_pinyin', 'like', "$regionName%") ->value('region_name');
                    $temp['region_name'] = $tempRegionName ? $tempRegionName : '';
                   
                    $getData_message['data'][$kkk] =$temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getRegiony is success',
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

    //获取城市的访问数据（原方法，已经改为下面的方法）
    /* public function get_UserCountry_getCity(){
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
            
            $entity_param['method'] = 'UserCountry.getCity'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){

                foreach($getData_message['data'] as $kkk=>$vvvv){
                    $temp = [];
                    
                    $temp['label'] =$vvvv['label']; //访问国家的城市  'Guangzhou, Guangdong, 中国'
                    $temp['country_name'] =$vvvv['country_name']; //访问国家的名称 ，中国
                    $temp['region_name'] =$vvvv['region_name']; //访问国家的省份名称 ，guangdong
                    $temp['city_name'] =$vvvv['city_name']; //访问国家的城市名称 ，guangzhou
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量

                   
                    $getData_message['data'][$kkk] =$temp;
                }
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getCity is success',
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
    */



     //获取城市的访问数据
     public function get_UserCountry_getCity(){ 
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
            
            $entity_param['method'] = 'UserCountry.getCity'; //当前的方法
            $data_class = new Data();
            $getData_message = $data_class->get_data($entity_param);

            if($getData_message['code'] == 200){

                  foreach($getData_message['data'] as $kkk=>$vvvv){
                    $temp = [];
                    
                    $temp['label'] =$vvvv['label']; //访问国家的城市  'Guangzhou, Guangdong, 中国'
                    $temp['country_name'] =$vvvv['country_name']; //访问国家的名称 ，中国
                    $temp['region_name'] =$vvvv['region_name']; //访问国家的省份名称 ，guangdong
                  //  $temp['city_name'] =$vvvv['city_name']; //访问国家的城市名称 ，guangzhou
                    $temp['nb_visits'] =$vvvv['nb_visits']; // 访问数量
                    $temp['country'] =$vvvv['country']; // 国家 简称： 例如 cn  
                    $temp['region'] =$vvvv['region']; // 省份简称 ：  例如广东省的是 GD
                    $cityName =ucfirst($vvvv['city_name']);
                    $tempCityName = db('region')->where('region_name_pinyin', 'like', "$cityName%") ->value('region_name');
                    $temp['city_name'] = $tempCityName ? $tempCityName :  $vvvv['city_name'] ;
                    $getData_message['data'][$kkk] =$temp;
                }  
                $return_data = array(
                    'data' => $getData_message['data'],
                    'message' => 'getCity is success',
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

         return  $return_data ;
         
    }
    



}