<?php

namespace app\index2\controller;

use app\common\Token;
use think\Db;
use think\Exception;
use app\index2\controller\Items;

class Edit extends Base {
    //get_edit_model.josn
    public function get_model() {
        $res = array(
            'code' => 201,
            'message' => '',
            'data' => [],
        );
        $path = input('param.path');

        try{

            if (empty($path)) {
                throw new \Exception('请提供参数 path ！');
            }
            
            $model_path = "./edit/path/$path/model.json";
            //$model_path = "https://todo.kangyun3d.cn/edit/path/8bf954c354b289397d1fa1d0597cae72/model.json?ver=0.922118226567";
            $get_model_json = file_get_contents($model_path);
            $res['code'] = 200;
            $res['message'] = 'is success!';
            $res['data'] = json_decode($get_model_json,true);
        } catch (\Exception $e) {
            $res['message'] = $e->getMessage();
        }

        echo json_encode($res,JSON_UNESCAPED_SLASHES);
    }

    //get_scanItems_model.josn
    public function get_scan_model() {
        $res = array(
            'code' => 201,
            'message' => '',
            'data' => [],
        );
        
        try{
            $path = input('param.path');
            if (empty($path)) {
                throw new \Exception('请提供参数 path ！');
            }
            $path = str_replace( array('\\','/','"' ,"'"," ") ,'',$path );

           
            
            $model_path = "./scanItems/path/".$path."/model.json";
            //$model_path = "https://todo.kangyun3d.cn/scanItems/path/8bf954c354b289397d1fa1d0597cae72/model.json?ver=0.922118226567";
            $items = new Items();
            $get_outlink_items = $items ->outlink_items(['dirname'=> $path], true);  //获取数据库中项目的信息
            $get_model_json = file_get_contents($model_path);
            $res['code'] = 200;
            $res['message'] = 'is success!';
            $res['data'] = json_decode($get_model_json,true);
            $res['data']['outlink_items'] =  $get_outlink_items; //将数据库中获取的项目信息返回到san_model中
        } catch (\Exception $e) {
            $res['message'] = $e->getMessage();
        }

        echo json_encode($res,JSON_UNESCAPED_SLASHES);
    }

    //同步  animate.json
    public function json_file_publish() {
        $code = 0;
        $res = array(
            // 'modelpath' =>$modelpath,
            'aspath' => '',
            'path' => '',
            'message'=>''
        );
        
        try{
            $entity = input('param.');
            $json = input('param.json');
            $path = input('param.path');
            //exec("/www/wwwroot/spaceChmod.sh");
            //exec("/www/wwwroot/todo.kangyun3d.cn/public/spaceChmod.sh $path");


           /*  $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $_param = [];
            $_param['company_id'] = $userData['company_id'];
            $_param['user_id'] = $userData['user_id'];
            $_param['user_type'] = $userData['user_type'];
            $_param['where']['dirname'] = $path;
            $_param['where']['company_id'] = $userData['company_id'];
            $getItemsMessage = $this->find_items($_param);
            if ($getItemsMessage['code'] != 200) {
                //return false;
                $this->json_echo(['权限不够！'], 0);
                exit;
            } */

            if (!empty($json) && !empty($path)) {
                // $modelpath = "./edit/path/$path/animate.json";
                $aspath = "./scanItems/path/$path/animate.json";
                // file_put_contents($modelpath,$json);
                file_put_contents($aspath, $json, LOCK_EX);
                $res = array(
                    // 'modelpath' =>$modelpath,
                    'aspath' => $aspath,
                    'path' => $path,
                    'message'=>'is success!',
                );
                $code = 1;
            }
        } catch (\Exception $e) {
            $res['message'] = $e->getMessage();
        }
        
        $this->json_echo($res, $code);
        exit;
    }

    // 更新 edit - animate.json
    public function json_file() {
        $code = 0;
        try{

            $entity = input('param.');
            $json = input('param.json');
            $path = input('param.path');

            /* $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                $_param = [];
                $_param['company_id'] = $userData['company_id'];
                $_param['user_id'] = $userData['user_id'];
                $_param['user_type'] = $userData['user_type'];
                $_param['where']['dirname'] = $path;
                $_param['where']['company_id'] = $userData['company_id'];
                $getItemsMessage = $this->find_items($_param);
                if ($getItemsMessage['code'] != 200) {
                    $this->json_echo(['权限不够！'], 0);
                    exit;
                }
            */

            $res = [];

            if (!empty($json) && !empty($path)) {
                $modelpath = "./edit/path/$path/animate.json";
                $aspath = "./scanItems/path/$path/animate.json";
                file_put_contents($modelpath, $json, LOCK_EX);
                // file_put_contents($aspath,$json);
                $res = array(
                    'modelpath' => $modelpath,
                    'aspath' => $aspath,
                    'path' => $path
                );
            }
            $code = 1;
        } catch (\Exception $e) {
            echo json_encode([
                'error' => 'error',
                'message' => $e->getMessage()
            ], 0);
            exit;
        }

        $this->json_echo($res,$code);
    }

    // 更新 edit - model.json
    public function edit_json() {
        $res = [];
        try {
            $entity = input('param.');
            $json = input('param.json');
            $path = input('param.path');
            $path = str_replace(array('"',"'","/"),'',$path);



            /* 
                $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                $_param = [];
                $_param['company_id'] = $userData['company_id'];
                $_param['user_id'] = $userData['user_id'];
                $_param['user_type'] = $userData['user_type'];
                $_param['where']['dirname'] = $path;
                $_param['where']['company_id'] = $userData['company_id'];
                $getItemsMessage = $this->find_items($_param);
                if ($getItemsMessage['code'] != 200) {
                    
                    $error_message_temp = ['权限不够！'];
                    if($getItemsMessage['code'] == 404){
                        $error_message_temp = [ $getItemsMessage['message']];
                    }
                    $this->json_echo($error_message_temp, 0);
                    exit;
                } 
            */

            $modelpath = "./edit/path/$path/model.json";
            //$aspath = "./scanItems/path/$path/model.json";

          
            if(file_exists( $modelpath)){
                unlink( $modelpath);
            }
            
            $aa = file_put_contents($modelpath, $json, LOCK_EX);
            // file_put_contents($aspath, $json);
            $res = array(
                'modelpath' => $modelpath,
                //'aspath' => $aspath,
                'path' => $path,
                'aa' => $aa //文件的长度
            );


            try{
                //删除没有用的静态资源文件
                $reg = "/uploads\/edit_file\/([A-Za-z0-9]{20,40})\/((.*?)\/(.*?))(\'|\")/";
                preg_match_all($reg, $json, $return_data);
                $has_data = [];
                foreach($return_data[0] as $k=>$url){  //有的数据，需要保留
                    $url = str_replace(array('"',"'"),'',$url);
                    if($return_data[3][$k] == 'gltf'){
                        // uploads/edit_file/57bb5bc2de9cc3d65a4249db9aeb2575/gltf/up20190410180640c624cc59e4d8a27e2aefb6f4176b54/gltf_duojimulu/c/microphone_gxl_066_bafhcteks/scene.gltf"
                        $temp_path = 'uploads\/edit_file\/'. $return_data[1][0].'\/gltf'; 
                        
                        $reg = "/$temp_path\/([A-Za-z0-9]{10,50})/";
                        preg_match($reg, $url, $return_path);
                
                    
                        if( !empty($return_path)){
                            $temp_all_tree = $this->get_tree($return_path[0]);
                        
                            $has_data = array_merge($has_data , $temp_all_tree);
                        } 
                        
                    
                    }else{
                        
                        $has_data[] = $url;//其他非gltf路径下的文件
                        
                    }
                
                
                }

                $all_tree = $this->get_tree('uploads/edit_file/'.$path); //获取某项目所有的文件名

                
                $no_data=[];
                foreach($all_tree as $src){
                    $no_data[$src] = $src;
                }        
                foreach($has_data as $src){ //忽略正在使用的静态资源
                    
                    if(isset($no_data[$src])){
                    
                        unset($no_data[$src] );
                        
                    } 
                }

                foreach($no_data as $src){//删除多余的文件
                    if(file_exists($src)){
                        unlink($src);
                    }
                }

                //删除空目录 递归// 如果是目录则继续遍历
                $this->rm_empty_dir('uploads/edit_file/'.$path ."/gltf");          


                $res['delete_static_source_file'] = 'success!';
                
            }catch(\Exception $ee){
                $res['delete_static_source_file'] = $ee->getMessage();
                //$this->json_echo($res, 1);
            }
            
            

            
        } catch (\Exception $e) {
            $this->json_echo([$e->getMessage()], 0);
        }
        $this->json_echo($res, 1);

    }

    /*
       递归获取所有的文件
        $path = 目录或者文件名
        $all_tree 返回一维数组，所有的文件名
    */
    public function get_tree($path = '',&$all_tree = []){
        if(is_dir($path)){
            $files = scandir($path);
            foreach($files  as $file){
                if($file == '.' || $file == '..' ){
                    continue;
                }
                 
                $this->get_tree($path .'/'.$file , $all_tree);
                 
            }
        }else{
            $all_tree[] = $path;
        }
        
        return $all_tree; 
    }

    /** 删除所有空目录 递归
    * @param String $path 目录路径
    */
    function rm_empty_dir($path=''){
        if(is_dir($path) && ($handle = opendir($path))!==false){
            while(($file=readdir($handle))!==false){     // 遍历文件夹
                if($file!='.' && $file!='..'){
                    $curfile = $path.'/'.$file;          // 当前目录
                    if(is_dir($curfile)){                // 目录
                        $this->rm_empty_dir($curfile);          // 如果是目录则继续遍历
                        if(count(scandir($curfile))==2){ // 目录为空,=2是因为. 和 ..存在
                            rmdir($curfile);             // 删除空目录
                        }
                    }
                }
            }
            closedir($handle);
        }


    }

    /*
    * 发布作品 san-> model.json
    */
    public function sendpub() {
        $entity = input('param.');
        // $res = exec("/www/wwwroot/spaceChmod.sh");
        $path = input('param.path');
        /* $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        $_param = [];
        $_param['company_id'] = $userData['company_id'];
        $_param['user_id'] = $userData['user_id'];
        $_param['user_type'] = $userData['user_type'];
        $_param['where']['dirname'] = $path;
        $_param['where']['company_id'] = $userData['company_id'];
        $getItemsMessage = $this->find_items($_param);
        if ($getItemsMessage['code'] != 200) {
            $this->json_echo(['权限不够！'], 0);
            exit;
        } */


        if (!empty($path)) {
            $message = [];
            $modelpath = "./edit/path/$path/model.json";
            $aspath = "./scanItems/path/$path/model.json";
            try {
                //更新户型图 和导航图 Map_B Map  (导航图 Map) (户型图 Map_B)

                $edit_map_b = './edit/path/'.$path.'/Map_B.png';
                $edit_map = './edit/path/'.$path.'/Map.png';

                //发布版
                $scanItems_map_b = './scanItems/path/'.$path.'/Map_B.png';
                $scanItems_map = './scanItems/path/'.$path.'/Map.png';


                if (file_exists( $scanItems_map_b)) {
                    unlink($scanItems_map_b);
                }

                if (file_exists($edit_map_b)) {
                    copy($edit_map_b, $scanItems_map_b);
                }

                if (file_exists($scanItems_map)) {
                    unlink($scanItems_map);
                }

                if (file_exists($edit_map)) {
                    copy(  $edit_map , $scanItems_map);
                }
                     
                // $json = file_get_contents($modelpath);
                // $jsonS = json_decode($json, true);
                //$statr = file_put_contents($aspath, json_encode($jsonS), LOCK_EX);
                // $jsonS = json_decode($json, true);
                // $statr = file_put_contents($aspath, $json, LOCK_EX);



                $json = file_get_contents($modelpath); 
                $jsonData = json_decode($json, true);
                $items = new Items;
                $itemsData = $items->outlink_items(['dirname'=> $path  ], true);
                $jsonData['outlink_items'] =  $itemsData ;
                $jsonDataTwo = json_encode($jsonData);
                
                if (file_exists($aspath)) {
                    unlink($aspath);//先删除,否则快速从浏览器获取会出现数据不完整
                }

                $statr = file_put_contents($aspath, $jsonDataTwo, LOCK_EX);

                /* $f = fopen($aspath,"w+");
                fwrite($f , $jsonDataTwo);
                fclose($f); */

                //$test_sdfsadfasd_gasdf = file_get_contents($aspath);
                $strleng = strlen($jsonDataTwo);
                if ($statr <= $strleng) {
                    $message[] = $statr;
                    $message[] = $strleng;
                    $code = 1;
                } else {
                    $code = 0;
                    $message[] = $statr;
                    $message[] = $strleng;
                }

            } catch (Exception $exception) {
                $code = 0;
                $message = $exception->getMessage();
            }

            $this->json_echo([$message], $code);
            //$this->json_echo([$message,'data' => $jsonData], $code);

        } else {
            $this->json_echo(['path is empty'], 0) ;
        }

    }
   
    /*
    * 文件截屏图片保存
    */
    public function screen_file() {
        $entity = input('param.');

       /* $entity['_'] = $_SERVER['HTTP_TOKEN'];

         $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        $_param = [];
        $_param['company_id'] = $userData['company_id'];
        $_param['user_id'] = $userData['user_id'];
        $_param['user_type'] = $userData['user_type'];
        $_param['where']['id'] = input('param.itemid');

        $_param['where']['company_id'] = $userData['company_id'];
        $getItemsMessage = $this->find_items($_param);
        if ($getItemsMessage['code'] != 200) {
            $this->json_echo(['权限不够！'], 0);
            exit;
        } */

        try {
            $file = request()->file('file');
            $itemid = input('param.itemid');
            $base64img = input('param.file');

            if (strstr($base64img, ",")) {
                $base64img = explode(',', $base64img);
                $base64img = $base64img[1];
            }

            $find_items = Db::name('items')->where('id', $itemid )->field('dirname,id')->find();
            
            if(empty($find_items)){
                throw new \Exception('没有该项目！');
            }
            $items_dirname =  $find_items['dirname'];
            
           
            if(is_dir('./uploads/edit_file/') === false){
                mkdir('./uploads/edit_file/');
            }
            if(is_dir('./uploads/edit_file/'.$items_dirname) === false){
                mkdir('./uploads/edit_file/'.$items_dirname);
            }

            $filepath = 'uploads/edit_file/'.$items_dirname.'/'.'screen_images/';
            if(is_dir( $filepath  ) === false){
                mkdir($filepath  );
            }
            
            $temp_uniqid  = 'jietu' . date('ymdHi') . mt_rand(1000,9999) . uniqid() . mt_rand(1000,9999);
            //$filepath = 'uploads/edit_file/'.$items_dirname.'/'.'screen_images/'.$temp_uniqid ;
            //mkdir($filepath); //创建存储目录 */
            $src =  $filepath .$temp_uniqid  . '.png';
            file_put_contents(  $src, base64_decode($base64img));
            
            
            /* $map['itemid'] = $itemid;
            $map['src'] = $src;
            $map['name'] = uniqid() . mt_rand(1000,9999) .mt_rand(1000,9999) ;
            $map['addtime'] = time();
            $res = Db::name('item_src')->insert($map); */
             
            //if ($res) {
                $resarr = array(
                    'src' => $src
                );
                Db::name('items')->where(['id' => $itemid])->update(['marker_image' => $src]);
                $this->json_echo($resarr, 1);
            /* } else {
                $this->json_echo([], 0);
            } */
        } catch (\Exception $e) {
            //echo $e->getMeaage();
            $this->json_echo(['error'=>$e->getMessage()], 0);

        }
    }


    public function find_items($param) {
        $field = [];
        $where = [];
        if (!empty($param['where'])) {
            $where = $param['where'];
        }
        /*  if(!empty($param['field'])){
             $field = $param['field'];
         } */
        $field = ['company_id,id,user_id'];

        try {
            $getItems = Db::name('items')->where($where)->field($field)->find();
            if ($getItems) {
                //echo 1;
                if ($param['user_type'] == 3) {
                   // echo 2;
                    if ($param['user_id'] != $getItems['user_id']) {
                     //   echo 3;
                        $coop_message = Db::name("invite_cooperator")
                            ->where(['company_id' => $param['company_id'], 'items_id' => $getItems['id'], 'edit_type' => 2])
                            ->field('id')
                            ->find();
                        if ($coop_message) { //可以编辑
                         //   echo 4;
                            return ['code' => 200, 'message' => 'is can edit'];
                        } else {
                         //   echo 5;
                            return ['code' => 203, 'message' => 'you can’t edit'];
                        }
                    }
                } else {
                   // echo 6;
                    return ['code' => 200, 'message' => 'is can edit'];
                }
            } else {
               // echo 7;
                return ['code' => 201, 'messsage' => 'items is empty'];
            }

        } catch (\Exception $e) {
            //echo 8;
            return ['code' => 404, 'message' => $e->getMessage()];
        }
    }
    

}