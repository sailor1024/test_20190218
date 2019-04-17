<?php
namespace app\index2\controller;

use think\Db;
use think\Exception;

/**
 * @title 文件上传
 * @class Upload
 */
class Upload extends Base {
    /**
     * @title 资源文件上传
     * @url /index/Upload/upload_file
     * @param File file 文件资源 空 必须
     * @param string userid 用户id 空 必须
     * @param string longitude 经度 空 必须
     * @param string 纬度 用户id 空 必须
     * @param string title 标题 空 必须
     * @method POST
     * @code 1 成功
     * @code 0 失败
     * @return int code 状态码
     * @return obj data 返回的用户数据数据
     * @return obj data[].srcpath 网络上的路径
     * http://api.map.baidu.com/geocoder/v2/?location=23.1719077696,113.4418468091&output=json&ak=32f38c9491f2da9eb61106aaab1e9739
     */
    public function upload_file() {
        $date_time = time();
        if (input('param.userid')) {
            $uuid = md5( mt_rand(123456,987654) . uniqid() . mt_rand(123456, 654321));
            // $uuid = $this->get_uuid(); //md5(uniqid());
            $edit_url = 'edit' . DS . '?p=' . $uuid;
            $url = 'scanItems' . DS . '?p=' . $uuid;
            // $url = 'scanItems' . DS . 'path' . DS . '?p=' . $uuid;
            $dir_url = 'scanItems' . DS . 'path' . DS . $uuid;
            // mkdir('./' . $dir_url);
            $map['user_id'] = input('param.userid');
            $map['company_id'] = !empty(input('param.company_id')) ? input('param.company_id') : 0;
           // $map['company_id'] = $company_id;
            $map['longitude'] = !empty(input('param.longitude')) ? input('param.longitude') : 0.00000; //经度
            $map['latitude'] = !empty(input('param.latitude')) ?  input('param.latitude') : 0.00000;  //纬度
            $map['title'] = !empty(input('param.title')) ?  input('param.title') : '';
            $map['edit_url'] = $edit_url;
            $map['dirname'] = $uuid;
            $map['url'] = $url;
            $map['create_time'] = $date_time;
            $map['update_time'] = $date_time;
            $map['sorts'] = 999999;
            $map['addtime'] = date('Y-m-d H:i:s', $date_time);
            $map['address'] =!empty(input('param.SSQ')) ?  input('param.SSQ') : '';
           // $map['location'] =!empty(input('param.JD')) ?  input('param.JD'): '';
            $map['location'] =!empty(input('param.location')) ?  input('param.location'): ''; 
            $map['valid'] = 1;
            $map['high_floor'] = 1;//最高层
            //$code = model('Items')->save_item($map);
            Db::startTrans();
            try {
                
                $code = Db::name('Items')->insertGetId($map);
                //修改path字段
                Db::name('Items')->where(['id' => $code])->setField('path', $code);
                Db::commit();
            } catch (Exception $exception) {
                Db::rollback();
                $this->json_echo([$exception->getMessage()], 0);
                
            }

            $array = array(
                'url' => $edit_url,
                'dir' => $dir_url,
                'dirname' => $uuid
            );
            if ($code) {
                //  $dirname = dirname;
                //                $toDir = '.' . DS . 'assets' . DS . 'museum' . DS . '01' . DS . $dirname;
                //                $dir = '.' . DS . 'assets' . DS . 'modal' . DS . 'scanItems' . DS . '01' . DS . $dirname;
                //
                //                $this->recurse_copy($dir, $toDir);
                $this->json_echo($array, 1);
            } else {
                $this->json_echo([], 0);
            }
        } else {
            $this->json_echo([], 0);
        }
    }

   
    /***
     * 文件拷贝，将上传的文件拷贝至编辑目录下
     * 开始copy
     * museum
     */
    public function start_copy() {
        $dirname = input('param.dirname');

        if (empty($dirname)) {
            return false;
        }

        $toDir = './' . 'edit' . DS . 'path' . DS . $dirname;
        $dir = './' . 'scanItems' . DS . 'path' . DS . $dirname;

        $this->recurse_copy($dir, $toDir);
    }

    public function recurse_copy($src, $dst) {
        // 原目录，复制到的目录
        $dir = opendir($src);
        @mkdir($dst, 0777);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    $this->recurse_copy($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }

    /***
     * 文件上传
     */
    /*  public function file_test()
    {
        try {
            $zipname = '';
            foreach ($_FILES as $key => $value) {
                $zipname = $value['name'];
            }
            $file = request()->file('file');
            $pname = input('param.name');
            $srcpath = '';
            $uzipath = '';
            $code = 0;
            if ($file) {
                $filepath = '.' . DS . '' . DS . 'edit' . DS . 'path' . DS . $pname;
                $info = $file->move($filepath, false, false);
                if ($info) {
                    // 成功上传后 获取上传信息
                    $srcpath = $filepath . DS . $info->getSaveName();
                    $zip = new \ZipArchive();
                    if ($zip->open($srcpath) === TRUE) {
                        $uzipath = 'edit/path/' . $this->get_uuid();
                        $res = $zip->extractTo('./' . $uzipath);
                        if ($res == true) {
                            $code = 1;
                            // @unlink($srcpath);
                            $srcpath = $uzipath;
                        }
                        $zip->close();
                    }
                }
                $array = array(
                    'srcpath' => $uzipath
                );
                // $this->save_item($array,$uzipath);
            }
        } catch (Exception $e) {
        }
    } */

    /***
     * 编辑出文件上传
     */
    public function edit_file() {
        
        //header('Access-Control-Allow-Origin:*');
       // header("Access-Control-Allow-Headers: *");

        /* $entity = input('param.');
        $entity['_'] = $_SERVER['HTTP_TOKEN'];
         
        $userData = Token::getUserGreps(['key_name' => $entity['_']]);
        $_param=[];
        $_param['company_id'] = $userData['company_id'];
        $_param['user_id'] = $userData['user_id'];
        $_param['user_type'] = $userData['user_type'];
        $_param['where']['dirname'] = input('param.path');

        $_param['where']['company_id'] = $userData['company_id'];
        $getItemsMessage = $this->find_items($_param);
        if($getItemsMessage['code'] != 200){
            $this->json_echo(['权限不够！'], 0);
            exit;
        }   */
        $code = 0;
        try {

            if(empty( $_SERVER['HTTP_PATH'])){
                throw  new \Exception('请添加路径 path');
            }else{
                $dirname =$_SERVER['HTTP_PATH']; //项目目录名
                $dirname = str_replace(array( '/','"' ,"'"," ") ,'',  $dirname)  ;
                
            }
           
            if(empty($_FILES['file'])){
                 throw  new \Exception('file 上传空');
            } 
            $file = $_FILES['file'];

            
            //$upload_type = 'img';
            $upload_type = $_SERVER['HTTP_UPLOADWAY']; //上传文件类型
            if ($upload_type == 'img') {
                $info = 'img is empty !';
            } else if ($upload_type == 'audio') {
                $info = 'audio is empty !';
            }else if($upload_type == '3video'){
                $info = '3video is empty !';
            }else if($upload_type == '3img'){
                $info = '3img is empty !';
            } else if ($upload_type == 'video') {
                $info = 'video is empty !';
            } else if($upload_type == 'backaudio'){ //因为其他都是二维数组过来了，所以需要将一维变为二维
                 
                $info = 'backaudio is empty !';
                $file1 = $_FILES['file'];
                $file = [];
                $file['tmp_name'][0] = $file1['tmp_name'] ; 
                $file['name'][0] = $file1['name'] ; 
                 
            } else if ($upload_type == 'gltf') { //该类型单独调用接口
                //$info = 'glft is empty !';
                $file_temp = request()->file('file')[0]; // tp框架封装的方式

               

                $return_data = $this->gltf_zip( $file_temp  ,  $dirname   );
               // $return_data = json_decode($return_data ,true);
                $gltf_src = '';
                $code = 0;
                $info = $return_data['message'];
                if ($return_data['code'] == 200) {
                    $gltf_src = $return_data['data']['gltf_path_root'];
                    $code = 1;
                } else {
                    $code = 0;
                }
                $res = ['src' =>$gltf_src , 'info' => $info,'file_dir_path'=>'','file_type'=>'gltf'];
                $this->json_echo($res, $code);
                exit;
                
            } else {
                $info = 'file type is not gltf|img|audio|video|backaudio|3video|3img !'; 
                $this->json_echo(['code'=>0,'info' => $info]);
                exit;
            }
             
            $code = 0 ;
            $file_name = '';
            $file_dir_path = '';//文件夹路径         
 
            if ((is_dir('./uploads/edit_file') )=== false) {
                mkdir('./uploads/edit_file' );
            }   

            if( (is_dir('./uploads/edit_file/' . $dirname)) === false){
                mkdir('./uploads/edit_file/' . $dirname );
            } 

            $file_dir_path = 'uploads/edit_file/'  .  $dirname . '/' . $upload_type . '/' ;
           
            if( (is_dir( $file_dir_path  )) === false){
                mkdir( $file_dir_path  );
            }  

            $date = date('YmdHi');
            
            $temp_path_name = 'up'. $date  .md5( mt_rand(1000,9999) . uniqid() . mt_rand(1000,9999)   ); //随机名

            //$file_dir_path = $file_dir_path_last . $temp_path_name . '/';
            //mkdir(  $file_dir_path); //创建一个随机名称目录

            $get_file_arr = explode('.',$file['name'][0]);
            $get_file_ext = end( $get_file_arr ); //取后缀名
            $file_name =  $temp_path_name .'.' . $get_file_ext ;
            $t = move_uploaded_file($file['tmp_name'][0],     $file_dir_path . $file_name   );
            
            $info = 'file is '. $file['name'][0] ; //测试用
        

            $code = 1;
            $info = 'is success!';

            if ($file_name == '') {
                $info = 'file_name is empty !';
                $code = 0;
            }
            if ($file_dir_path == ''  ) {
                $info = 'dir create error!';
                $code = 0;
            }

            
            $res = ['src' => $file_dir_path . $file_name, 'info' => $info,'file_dir_path'=>$file_dir_path ,'file_type'=>$upload_type];
        } catch (\Exception $e) {
            $info = $e->getMessage();
            $code = 0;
            $res = ['info' => $info,];
            
        }
        
        $this->json_echo($res, $code);
    }

   


    //上传 gltf 文件至 uploads/uploads_gltf/
     public function gltf_zip($file = [] , $dirname = '') {
        //uploads_gltf
        $return_data =array(
            'code' => 201,
            'message' => '',
            'data' => [
                'gltf_path' => '',
                'gltf_path_root' => '',
            ],
        );

        try {
                //$file = request()->file('file')[0];
                //dump($file);exit;
                // 移动到框架应用根目录/public/uploads/ 目录下
                $upload_size = 1024*1024 * 1000 ; //M 1000m
                if (empty($file)) {
                    throw new \Exception('no file upload');
                } else {
                    $arrss=explode('.', $_FILES['file']['name'][0]);
                    if ($arrss[count($arrss)-1] != 'zip') { 
                        throw new \Exception('请上传 zip 格式');
                    }  
                }

                if ((is_dir('./uploads/edit_file') )=== false) {
                    mkdir('./uploads/edit_file' );
                }   
    
                if( (is_dir('./uploads/edit_file/' . $dirname)) === false){
                    mkdir('./uploads/edit_file/' . $dirname );
                } 

                $gltf_dir_path = 'uploads/edit_file/'  .  $dirname . '/gltf'     ; //上传目录
                if( (is_dir( $gltf_dir_path    )) === false){
                    mkdir( $gltf_dir_path  );
                } 
                    
                 
                $uploads_gltf_path = ROOT_PATH . 'public' . DS . $gltf_dir_path;

                if ((is_dir($uploads_gltf_path)) == false) {
                    $a =  mkdir($uploads_gltf_path , 0777);
                }
            
                $today_date = date('YmdHi');
                $change_file_name = md5(mt_rand(1000,9999) . uniqid() . mt_rand(100,9999)) ;    
                $zip_today_date_change_file_name =  'up'.$today_date . $change_file_name ; 
                $info = $file->validate(['size'=>$upload_size,'ext'=>'zip'])->move($uploads_gltf_path, $zip_today_date_change_file_name ,true);
                
                if ($info) {
                    $un_path = $uploads_gltf_path .DS . $zip_today_date_change_file_name . '.'.$info->getExtension() ;
                    $save_dir_path = $uploads_gltf_path .DS . $zip_today_date_change_file_name ;

                    $info = null; //释放 unset无效
                    $save_data = $this-> unachive($un_path , $save_dir_path);
                    
                    if (!$save_data) {
                        throw new \Exception('文件解压异常');
                    }

                    if (is_dir($save_dir_path)) { //后台创建的目录
                        $files = [];
                        $file_dir_temp_path = $gltf_dir_path .DS . $zip_today_date_change_file_name ;//相对目录
                        $temp_return_gltfpath = $this->get_allfiles($save_dir_path,$files ,$file_dir_temp_path );  
                       if ($temp_return_gltfpath['code'] == 200) {
                        $temp_return_gltfpath['gltf_path'] = str_replace( '\\' ,'/' ,$temp_return_gltfpath['gltf_path'] ); //D:\software\file\.......
                        $http_link = $_SERVER['REQUEST_SCHEME'] .'://'.$_SERVER['HTTP_HOST'];//https://www.xxx.com
                            $return_data = array(
                                'code' => 200,
                                'message' => 'get gltf success!',
                                'data' => [
                                    //'gltf_path'=>$temp_return_gltfpath['gltf_path'],
                                    'file_dir_temp_path'=> $temp_return_gltfpath['file_dir_temp_path'],
                                    'gltf_path' => str_replace( $_SERVER['DOCUMENT_ROOT'] , $http_link  ,  $temp_return_gltfpath['gltf_path'] ),
                                    'gltf_path_root' => str_replace( $_SERVER['DOCUMENT_ROOT'].'/' , '' ,  $temp_return_gltfpath['gltf_path'] ),
                                ],
                               
                            ); //dump($_SERVER['DOCUMENT_ROOT']);
                       } else {
                            throw new \Exception('无法找到gltf文件');
                       }

                    } else {
                        //解压失败
                        throw new \Exception('文件解压失败');
                    }

                } else {
                    // 上传失败获取错误信息
                    //echo $file->getError();
                    throw new \Exception($file->getError());
                }

        } catch (\Exception $e) {
            $return_data =array(
                'code' => 401,
                'message' => $e->getMessage(),
                'data' => [],
            );
        }

        // $this->json_msg($return_data);
        return $return_data;

    }

    public function get_allfiles($path,&$files,$file_dir_temp_path = '') {  
        $temp_return_path = [
            'code'=>202,
            'gltf_path' =>'',
            'file_dir_temp_path' =>'',
        ];

        if (is_dir($path)) {  
            $dp = dir($path);  
            $get_array_file = array_reverse( scandir($path) );
          //  dump( $get_array_file);
             foreach ($get_array_file as $a_va) {
                if (is_file( $path .DS. $a_va)) {  
                    $arr=explode('.', $a_va);
                    if ($arr[count($arr)-1] == 'gltf') { //找到了gltf
                       // $temp_bin_file = str_replace('.gltf','.bin',$a_vafile);
                       //if(is_file($temp_bin_file)){ //同等级中有.bin文件
                      // } 
                      // dump($path .DS. $a_va);
                       $temp_return_path = [
                           'code' => 200,
                           'gltf_path' => $path .DS. $a_va,
                           'file_dir_temp_path' => $file_dir_temp_path .DS. $a_va,
                       ];
                      return $temp_return_path;
                      
                      // dump($temp_return_path);
                    } 
                } else {
                  //  echo 2;
                }
            } 
           // echo 333;
            //查找gltf 与bin
            
            while ($file = $dp ->read()) {  
                if ($file !== "." && $file !== "..") {  
                    $temp_return_path =   $this->get_allfiles($path.DS.$file,  $files,  $file_dir_temp_path.DS.$file);  
                }  
            }  
            $dp ->close();  
        }  
        /* if(is_file($path))
        {  
            //echo $path."<br/>";
            //$path = 'x.y.z.png';

            $arr=explode('.', $path);

            if($arr[count($arr)-1] == 'gltf'){
               

                echo $path."<br/>";
            }
        }   */
        return $temp_return_path;
        //return 33;
    } 

    /***
     * 对文件进行解压
     * @param tarpath 需要解压的文件地址
     * @param srcpath 解压存放的路径
     */
    public function unachive($tarpath, $srcpath) {
        mkdir($srcpath, 0777);
        $zip = new \ZipArchive();
        if ($zip->open($tarpath) === TRUE) {
            $res = $zip->extractTo($srcpath);
            $zip->close();
            @unlink($tarpath);
            return true;
        }

        return false;
    }

}