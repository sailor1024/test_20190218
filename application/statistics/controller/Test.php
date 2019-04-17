<?php
namespace app\statistics\controller;
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

}