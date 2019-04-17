<?php

namespace app\statisticstest\controller;
use app\index2\controller\Base;

//use think\cache\driver\Redis;
use think\cache\driver\File;
use app\common\Token;

/* use app\statisticstest\controller\Browser;
use app\statisticstest\controller\Comment; 
use app\statisticstest\controller\Device;
use app\statisticstest\controller\Language;
use app\statisticstest\controller\Location;
use app\statisticstest\controller\Loyalty;
use app\statisticstest\controller\Visittime;
use app\statisticstest\controller\Data; */

class Dataall extends Base{


    public function index(){
        echo 'GET DATALL!';
    }

    

    //数据统计的总入口函数
    public function get_selete_data(){
        // https://todo.kangyun3d.cn/index.php/statisticstest/dataall/index?&items_dirname=641b3ad9547fbd821d764372e150c7ac
        //https://todo.kangyun3d.cn/index.php/statisticstest/dataall/get_selete_data?items_dirname=641b3ad9547fbd821d764372e150c7ac&get_method_arr=Comment_praiseWeekStatistics,Comment_get_week_comment,Data_active_users_VisitorInterest,Data_history_VisitsSummary_getVisits,Data_all_VisitsSummary_get
        
        $all_return_data = [
            'code' => 201,
            'message' => 'is empty!',
            'data' =>[],
        ];
        

        $entity = input('param.');
        $get_method_arr = input('param.get_method_arr');

        $is_cache = ''; //测试是否是缓存数据
        $get_data = [] ;//初始化数据
        
        try{       
            if(empty($entity['get_data_type'])){ //如果有该参数可能是user或者company的数据
                $entity['get_data_type'] = 'items';
            
            }else{
                if($entity['get_data_type']  == 'items' || $entity['get_data_type']  == 'user' ||  $entity['get_data_type']  == 'company'){
                    
                }else{
                    throw new \Exception('填写的 get_data_type "'.$entity['get_data_type']  .'"  有误');
                }
            }

            $cache_index = ''; //缓存 文件名
            if(  $entity['get_data_type'] == 'items' ){
                if(empty($entity['items_dirname'])){
                    throw new \Exception('请添加项目  items_dirname!');
                }
                $cache_index = 'test_statistics_items_'. $entity['items_dirname'] ;
            }else{ //查公司或用户
                if(!empty($entity['_'])){
                    $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                    if($entity['get_data_type'] == 'company'){
                        $cache_index  = 'test_statistics_company_'. $userData['company_id'];
                    }else if($entity['get_data_type'] == 'user'){
                        $cache_index  = 'test_statistics_user_'. $userData['user_id'];
                    }
                }else{
                    throw new \Exception('请添加token');
                }
                
            }

            $cache = new File(); //先文件缓存
            //$cache = new Redis();  
            try{
                $get_cache_data = $cache->get($cache_index );
                if($get_cache_data !== false){ //有数据
                    $get_data = json_decode( $get_cache_data , true );
                    $is_cache = 'is_cache_data';
                }
            }catch(\Exception $e){

            }
           
            if(empty($get_data)){ //没有数据缓存

            
                $get_method_arr = str_replace(array('[',']','"' ,"'"," ") ,'',$get_method_arr );
                        
                $method_arr_2 = explode(',' ,  $get_method_arr); //将字符串转数组

                $getClassName = [];

            
            
                foreach($method_arr_2 as $k=>$v){
                    
                    $get_class_value = strstr($v , '_',true) ; //没有下划线将返回false ,有将返回第一个 _ 的前段部分
                    if($get_class_value !== false &&  !empty($get_class_value)){
                        if(!isset($getClassName[$get_class_value])){ //之前没有该类的创建
                            $getClassName[$get_class_value] = $get_class_value;
                            $new_Object = "\app\statisticstest\controller\\"  .  $get_class_value; //引进类

                            if(class_exists($new_Object)){ //判断是否有类

                                $obj[$get_class_value] = new $new_Object;
                            }else{
                                throw new \Exception('方法集合里没有 ' . $v . '！') ; //没有类
                            }                                                              
                            //echo  $new_Object ."<br/>";
                        }
                        
                        //获取方法
                        $get_method_value =  strstr($v , '_') ; // 将 Comment_get_week_comment 截取出  _get_week_comment
                        if(!empty($get_method_value ) && strlen($get_method_value) > 1){
                            $new_method_str =  substr($get_method_value , 1) ; // 从下标为1的字符串开始截取至最后,主要是为了截取去掉 '_'
                            //echo $new_method_str;

                            if(method_exists( $obj[$get_class_value] ,  $new_method_str ) ){ //判断方法是否存在
                                $get_data[$v] = call_user_func(array($obj[$get_class_value],   $new_method_str  )); //定义类和方法

                        }else{
                                throw new \Exception('方法集合中没有 ' . $v . '！') ; //其实是该类中没有方法   $new_method_str 
                            }                 
                        }                             
                    }
                    
                }

                try{
                    //缓存数据
                    $save_data =  json_encode( $get_data );
                    
                    $save_cache_data = $cache->set($cache_index , $save_data  , ( 10 * 1 ) ); //暂时缓存5分钟
                    if($save_cache_data === true){ //缓存成功
                        $is_cache = 'new_save_data';
                    }
                }catch(\Exception $e){
    
                }
            }
            
            $all_return_data = [
                'code' => 200,
                'message' => 'is success!',
                'data' =>$get_data,
                'is_cache' =>$is_cache,

            ];
        }catch(\Exception $e ){
            $all_return_data = [
                'code' => 202,
                'message' => $e->getMessage(),
                'data' =>[],
            ];
        }
       
        echo json_encode($all_return_data, JSON_UNESCAPED_UNICODE);
        exit;
        


    }
}