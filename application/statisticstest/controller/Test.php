<?php
namespace app\statisticstest\controller;
use think\cache\driver\Redis;

class Test{

    public function test(){
        $test_data = [
            "date" => date("Y-m-d H:i:s"),
            "desc" => 'hello world!' ,
            'rand' => mt_rand(123456789 , 987654321),
        ] ;
      $cache = new Redis();
      
      //$test_data = json_decode($test_data, true);
      //cache('name' , $test_data['data'] , 10);
      //$a = cache('name');
      
      $get_data = $cache->get('name');
      if($get_data === false){
          $save_data = json_encode( $test_data );
            $t = $cache->set('name' , $save_data , 30); //设置20秒
            echo  "保存成功！ <br/>";
            
        
            $get_data = $test_data ;
      }


      echo $get_data;
    }


    public function test_ip_addr(){
        // https://todo.kangyun3d.cn/index.php/statisticstest/test/test_ip_addr
        $addr_ip =  $_SERVER['REMOTE_ADDR'];
        $addr_ip_md5 = md5( $addr_ip );
        $get_all_ip = cache('save_all_ip');
        $turn_all_ip  = [];
        if($get_all_ip !== false){ //还没有存进去过
            $turn_all_ip = json_decode($get_all_ip , true); //将字符转数组
           
        }

        if(empty( $turn_all_ip[$addr_ip_md5]  )){
            $turn_all_ip[$addr_ip_md5] = $addr_ip ; //存进去新的ip
        }
       
        $json_all_ip = json_encode($turn_all_ip) ; 
        cache('save_all_ip' , $json_all_ip  , ( 60 * 60 * 24 ) ); //一天

        $test = [
            'code'=>200,
            'message' =>'is success' ,
            'data' => $turn_all_ip,
            'randon' => mt_rand(123456789,987654321) ,
            'ip_length' => count($turn_all_ip),
        ];
        echo  json_encode($test);


    }

}