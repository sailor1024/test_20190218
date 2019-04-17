<?php

namespace app\index2\controller;

use app\common\Token;
use app\index2\model\InviteCooperator;
use app\index2\model\Items as ItemsAs;
use app\index2\model\User;
use think\Exception;
use think\Db;
use app\statistics\controller\Data;
use app\statistics\controller\Comment;

class Items extends Base {
    /**正在使用用户 */
    public function reception(User $user) {
        $entity = input('param.');
        $this->setResult(false);
        try {
            //不管是管理员还是合作者看的正在使用的用户都是一样的
            // $entity['company_id'] = 1;
            $param['where']['company_id'] = $entity['company_id'];
            $param['where']['is_use'] = 1;//正常可用用户
            $param['field'] = ['id,user_type,decrypt_email,lastname,firstname'];
            $getUserList = $user->getList($param);
            if ($getUserList['info'] !== []) {
                $this->result['message'] = 'success!';
                $this->result['code'] = 200;
                $this->result['data'] = $getUserList['info'];
            }

        } catch (Exception $e) {
            $this->result['message'] = $e->getMessage();
        }
        $this->json_msg($this->result);
    }

    //获取model.json中的图片信息
    public function getJson() {
        $path = input('param.path');
        if (!empty($path)) {
            $modelPath = "./edit/path/$path/model.json";
            $content = file_get_contents($modelPath);
            $contents = json_decode($content);
            //$slider = $contents->slider;
            if (isset($contents->slider) ) {
                $this->json_echo($contents->slider);
            } else {
                $slider = [];
                $this->json_echo($slider);
            }
        }
    }

    //删除model.json文件中截屏图片的信息
    public function deletecutpic() {
        try {
            $path = input('param.path');
            // $path2 = $_REQUEST['path'];
            $src = json_decode(input('param.id'), true);
            // $src = $_REQUEST['id'];
            if (!empty($path)) {
                $modelPath = "./edit/path/$path/model.json";
                $content = file_get_contents($modelPath);
                $model_array = json_decode($content , true);
                // dump($con->slider);

                /* foreach ($con->slider as $key => $v) {
                    foreach ($src as $src_v) {
                        if ($v->src == $src_v) {
                            unset($con->slider[$key]);
                            break;
                        }
                    }
                } */
                
                foreach($model_array['slider'] as $kk=>$slider_vv){
                    foreach ($src as $src_k => $src_v) {
                        if ($slider_vv['src'] ==  $src_v) {
                            
                            unset($model_array['slider'][$kk] );
                            unset($src[$src_k]);
                            break;
                        }
                    }
                }
                $model_array['slider']  = array_merge( $model_array['slider']  , []); //重新排列键
                $con = json_encode( $model_array );
                //$replaceRes = str_replace($conSlider,$slider,$con);
                $res = file_put_contents($modelPath, $con);
                $this->json_echo($res, 1);
            }
        } catch (\Exception $e) {
            $this->json_echo([$e->getMessage()], 0);
        }
    }

    /***
     * 移动项目
     */
    public function mv_items(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_id'] = $entity['id'];// ID
            $fileStatus = $inviteCooperator->fecDiction($userData);
            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }
            $param['where']['id'] = $entity['id'];//项目ID
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            $param['field']['items_dir_id'] = empty($entity['dir_id'])?0:$entity['dir_id'];
            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }
            $this->result['data'] = $items->rmItems($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    /***
     *删除项目
     **/
    public function deteledir_project(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_id'] = $entity['id'];// 项目ID
            $fileStatus = $inviteCooperator->jurisdiction($userData);

            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $param['where']['id'] = $entity['id'];//项目ID
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            $param['where']['items_dir_id'] = empty($entity['dir_id'])?0:$entity['dir_id'];

            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }

            $this->result['data'] = $items->rmProject($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    /***
     * 修改项目详情保存接口
     **/
    public function save_detil(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_id'] = $entity['id'];// 项目ID
            $fileStatus = $inviteCooperator->jurisdiction($userData);

            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $param['where']['id'] = $entity['id'];//项目ID
            $param['where']['company_id'] = $userData['company_id'];// 公司ID
            //$param['where']['items_dir_id'] = empty($entity['dir_id']) ? 0 : $entity['dir_id'];

            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }

            $param['field']['title'] = $entity['title'];

            if (strlen($param['field']['title']) <= 2) {
                $this->setResult(407);
                $this->json_msg($this->result);
            }

            if (isset($entity['detail_link'])) {
                $param['field']['detail_link'] = $entity['detail_link'];
            }

            if (isset($entity['detail_username'])) {
                $param['field']['detail_username'] = $entity['detail_username'];
            }

            if (isset($entity['detail_presenter'])) {
                $param['field']['detail_presenter'] = $entity['detail_presenter'];
            }

            if (isset($entity['detail_phone'])) {
                $param['field']['detail_phone'] = $entity['detail_phone'];
            }

            if (isset($entity['detail_email'])) {
                $param['field']['detail_email'] = $entity['detail_email'];
            }

            if (isset($entity['description'])) {
                $param['field']['description'] = $entity['description'];
            }

            if (isset($entity['location'])) {
                $param['field']['location'] = $entity['location'];
            }

            if (isset($entity['items_orientation'])) { //朝向
                $param['field']['items_orientation'] = $entity['items_orientation'];
            }

            if (isset($entity['house_type'])) {//户型
                $param['field']['house_type'] = $entity['house_type'];
            }

            if (isset($entity['items_area'])) { //面积
                $param['field']['items_area'] = $entity['items_area'];
            }

            $param['field']['update_time'] = time();
            $this->result['data'] = $items->upItems($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    /**
     * @title 发布至百度地图或者公司官网
     * @url /index/index/send_bmap
     * @method POST
     * @param string id 需要发布的项目id 空 必须
     * @param string type 发布类型 1百度地图2公司官网 空 必须
     * @code 1 成功
     * @code 0 失败
     * @return int code 状态码
     * @return obj data 空数组
     */
    public function send_bmap(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $id = input('param.id');
        $type = input('param.type');
        $tk = input('_');
        try {
            $userData = Token::getUserGreps(['key_name' => $tk]);
            $userData['items_id'] = $id;// 项目ID
            $fileStatus = $inviteCooperator->jurisdiction($userData);
            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }
            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $uid = $userData['user_id'];
            }
            $this->result['data'] = $items->send_bmap($id, $type, $uid);
            // if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }

        $this->json_msg($this->result);
    }

    /***
     *设置项目私密或公开接口
     **/
    public function edit_isshow(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $userData['items_id'] = $entity['id'];// 项目ID
            $fileStatus = $inviteCooperator->jurisdiction($userData);

            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            }

            $param['where']['id'] = $entity['id'];//项目ID
            $param['where']['company_id'] = $userData['company_id'];// 公司ID

            if ($userData['user_type'] == 3 && $fileStatus != 2) {//普通用户
                $param['where']['user_id'] = $userData['user_id'];
            }

            $param['field']['isshow_offica'] = $entity['isshow_offica'];
            $this->result['data'] = $items->up($param);
            //if ($this->result['data']['code'] == 200) {
            $this->setResult($this->result['data']['code']);
            //}
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    /***
     * 项目合作者列表接口 //废弃
     */
    public function user_list(InviteCooperator $inviteCooperator, ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        try {

        } catch (\Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    //项目详情 (需要token)
    public function space_detil(ItemsAs $items) {
        $entity = input('param.');
        $param = [];
        $this->setResult(401);
        if (empty($entity['id'])) {
            $this->result = array(
                'message' => 'no items id',
                'code' => '401',
                'data' => []
            );
            $this->json_msg($this->result);
        }

        try {
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            // $userData = ['company_id' => 1, 'user_id' => 1, "user_type" => 1];
            /*$userData['items_id'] = $entity['dir_id'];// 父ID
             $fileStatus = $inviteCooperator->jurisdiction($userData);
            if ($fileStatus == 1) {//操作权限判断
                $this->setResult(400);
                $this->json_msg($this->result);
            } */
            $param['company_id'] = $userData['company_id'];
            $param['user_id'] = $userData['user_id'];
            $param['user_type'] = $userData['user_type'];
            //$entity['id'] =2003;
            $param['id'] = $entity['id'];
            /*user_id as userid,items_dir_id,additional_info,address,addtime,category,create_time,creator,description,detail_email,detail_link,
            detail_phone,detail_presenter,detail_username,dirname,edit_url,featured,id,isshow_bmap,
            isshow_offica,latitude,location,longitude,marker_color,marker_image,rating,ribbon,sorts,title,update_time,url,valid,video,website
            */
            $this->result = $items->spaceDetil($param);

            if ($this->result['code'] != 200) {
                $this->result['message'] = 'no edit';
                $this->json_msg($this->result);
            } 

            $this->result['data'] = $this->result['info'];
        } catch (Exception $exception) {
            $this->result['message'] = $exception->getMessage();
        }
        $this->json_msg($this->result);
    }

    //外联获取项目详情
    /*
        $entity = ''  $is_inner_use === false  是前端直接调用 
        $is_inner_use === true //内部调用用 
        内部调用传值为：->outlink_items(['dirname'=> ''  ] , true) ; 
    */
    public function outlink_items( $entity = '', $is_inner_use = false  ) {
        $result = array(
            'data' => [],
            'message' => 'is empty',
            'code' => 401,
        );

        try {
            $items = new ItemsAs();
            $param = [];

            if (empty($entity)) { // 判断是内部调用还是外部直接使用，空时外部直接使用
                $entity = input('param.');
            }

            //$entity = input('param.');
            //$entity['dirname'] = '6e7b7abf86df5501631bc5e93ec575f0';
            if (empty($entity['dirname'])) {
                throw new \Exception('请输入dirname');
            }

            $param['where']['dirname'] = $entity['dirname'];
            $param['field'] = ['id,path,company_id,items_dir_id,dirname,user_id,longitude,latitude,address,featured,title,location,detail_username,detail_presenter,detail_phone,detail_email,detail_link,website,category,rating,url,marker_image,additional_info,description,ribbon,video,marker_color,create_time,isshow_offica,isshow_bmap,sorts,update_time,edit_url,creator,valid,is_table,address_see,high_floor,addtime,items_area,items_orientation,house_type,pv'];
            $itemsData = $items->getArr($param);

            if ($itemsData['code'] == 200) {
                
                if ($itemsData['info']) { //将面积有 12.00改成 12
                    if (intval($itemsData['info']['items_area']) == $itemsData['info']['items_area']) { //取整 3.233=>3
                        $itemsData['info']['items_area'] = intval($itemsData['info']['items_area']);
                    }
                    //添加本地cookie是否点赞
                    $cookie = cookie('praise_'. $entity['dirname'] );
                     
                    if (empty( $cookie)) {
                        $itemsData['info']['is_praise'] = 2; //未点赞
                    } else {
                        $itemsData['info']['is_praise']  = 1 ; //已点赞
                    }
                }

                $result = array(
                    'data' => $itemsData['info'],
                    'message' => 'is success!',
                    'code' => 200,
                );
            }
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            //$this->json_msg($result);
        }

        if ($is_inner_use == false) {
            $this->json_msg($result);
        } else {
            return $result;
        }
        
    }
 
    //户型图 导航图 (导航图 Map) (户型图 Map_B)
    public function save_items_map(ItemsAs $items) {
        // param path
        // param _ this is token
        // param map_file this is map_image and is treama  
        $result = array(
            'data' => ['map_src'=> ''],
            'message' => 'is error',
            'code' => 201,
        );
        
        try {
            $entity['path'] =$_SERVER['HTTP_PATH'];
            $entity['_'] = $_SERVER['HTTP_TOKEN'];
            $entity['uploadtype'] = $_SERVER['HTTP_UPLOADTYPE']; //上传类型，可能是户型图，导航图等等
            //$entity['uploadtype'] = "Map";
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $path = $entity['path'];
            $_param_find_items = [];
            $_param_find_items['where']['company_id'] = $userData['company_id'];
            $_param_find_items['where']['dirname'] = $path; //路径名称  80626e292adc3f9d63be2ce3cba4220c
            $_param_find_items['field'] = ['id'];
            $find_items = $items->getArr($_param_find_items);
            if ($find_items['code'] == 200) {  //证明同公司且是存在的文件
                $map_file = $_FILES['file'];
               
                 if ($map_file) {
                    //获取后缀名
                    $arr=explode('.', $map_file['name']); 
                    $file_type_name = end($arr);//png ,jpg. webp
                    if ($file_type_name == 'png') {

                    } else {
                        throw new \Exception('请上传 png 图片！');
                    }
                    $edit_map = "./edit/path/".$path."/". $entity['uploadtype'] . '.'. $file_type_name;
                    //$aspath = "./scanItems/path/$path/animate.json";
                    /* if($map_file['name'] != 'Map.png'){
                        throw new \Exception('请上传图片为 Map.png！');
                    } */
                    if (file_exists($edit_map)) {
                        unlink($edit_map); //先删除
                    }

                $t = move_uploaded_file($map_file["tmp_name"] , $edit_map );
                if ($t) {
                    $result = [
                        'code' => 200,
                        'message'=>'is success!',
                        'data' =>[
                            'map_src'=> $edit_map
                        ]
                    ];
                }

                 } else {
                    throw new \Exception('请上传图片！');
                 }

            } else {
               throw new \Exception('没有该文件！'); 
            }
        } catch (\Exception $e) {
            $result['message'] = $e->getMessage();
            $this->json_msg($result);
        }
        $this->json_msg($result);
    }

    //删除户型图 导航图 (导航图 Map) (户型图 Map_B)
    //https://todo.kangyun3d.cn/index.php/index2/items/delete_items_map
    // deletetype=Map_B Map   TOKEN='dsfdsfdsf2380ewrewrew' path="dirname"
    public function delete_items_map() {
        $return_data = array(
            'data'=>[],
            'code'=>201,
            'message'=>'empty'
        );

        try{
            $path = $_SERVER['HTTP_PATH'];
            $entity['_'] = $_SERVER['HTTP_TOKEN'];
            $entity['deletetype'] = $_SERVER['HTTP_DELETETYPE']; //上传类型，可能是户型图，导航图等等
            $userData = Token::getUserGreps(['key_name' => $entity['_']]);
            $edit_map_b = './edit/path/'.$path.'/Map_B.png';
            $edit_map = './edit/path/'.$path.'/Map.png';
            //发布版
            $scanItems_map_b = './scanItems/path/'.$path.'/Map_B.png';
            $scanItems_map = './scanItems/path/'.$path.'/Map.png';

            if (strtolower($entity['deletetype']) == 'map_b') {

                if (file_exists( $scanItems_map_b)) {
                    unlink($scanItems_map_b);
                }

                if(file_exists($edit_map_b)){
                    unlink($edit_map_b);
                }

            } else if ( strtolower($entity['deletetype']) == 'map') {
                if (file_exists($scanItems_map)) {
                    unlink($scanItems_map);
                }

                if (file_exists($edit_map)) {
                    unlink($edit_map);
                }

            } else {
                throw new \Exception('删除类型错误');
            }
                
            $return_data = [
                'data' => [
                    'deletetype' =>  $entity['deletetype'],
                ],
                'code' =>200,
                'message'=>'删除成功！'
            ];

        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code'=> 401,
            );
        }
        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
        exit;
    }


    //查看数据统计的websiteId
    /*
        param string itmes_dirname 项目目录名
    */
    public function get_siteid() {
        /**
         * INSERT INTO `newTodo`.`matomo_site`(
         * `idsite`, `name`, `main_url`, `ts_created`, 
         * `ecommerce`, `sitesearch`, `sitesearch_keyword_parameters`,
         *  `sitesearch_category_parameters`, `timezone`, `currency`, 
         * `exclude_unknown_urls`, `excluded_ips`, `excluded_parameters`,
         *  `excluded_user_agents`, `group`, `type`, `keep_url_fragment`, 
         * `creator_login`) VALUES (1, '康云统计', 'http://kangyun_data.com', 
         * '2019-01-18 08:37:52', 0, 1, '', '', 'Asia/Shanghai', 'CNY', 0, '', 
         * '', '', '', 'website', 0, 'anonymous');
         * 
         *  */
        $save_most_new_visit_time_data = [];//测试用    
        $return_data = array(
            'data'=>[],
            'message'=>'',
            'code'=>202,
        );

        try{
            $entity = input('param.');

            if (empty($entity['items_dirname'])) {
                throw new \Exception('items_dirname is need!');
            }
            
            $get_site_data = $this->getSite($entity);  //考虑到其他地方也调用，所以分开写
           
            if ($get_site_data['code'] != 200) {
                throw new \Exception($get_site_data['message']);
            }

            //保存项目的一些访问信息
            $save_most_new_visit_time_data = $this->save_most_new_visit_time($entity);
            $return_data = array(
                'data' => $get_site_data['data'],
                'message' => 'get siteid success!',
                'code' => 200,
                'save_most_new_visit_time_data' => $save_most_new_visit_time_data,
            );

        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }
        
        echo json_encode($return_data);
        //$this->json_msg($return_data);
    }

    //统计 //获取到matoma的保存到的siteId数据，如果没有则创建
    /*
        param string items_dirname 项目目录名
        param select_type 查找类型 user company items //暂时不用
    */
    public function getSite($entity) {
        $return_data = array(
            'data' => [],
            'message' => '',
            'code' => 201,
        );

        try{
            $get_data = [];
            $get_data = Db::table('matomo_site')->where('items_dirname', $entity['items_dirname'])->field('idsite,items_dirname,company_siteid,user_siteid')->find();//查找项目id

            if (empty($get_data)) {//证明没有该项目插入，所有需要插入
                //先去找是否有该项目
                $get_items = Db::table('items')->where('dirname', $entity['items_dirname'])->field('id,company_id,user_id,dirname')->find();

                if (empty($get_items)) { //如果没有，就退出,
                    $add_param_fsdfas2sdf1fds = [
                        'items_dirname' =>$entity['items_dirname'],
                        'time'=>date("Y-m-d H:i:s") ,
                    ];
                    //Db::table('test_save_no_items')->insert($add_param_fsdfas2sdf1fds);
                    //throw new \Exception('no the items!'); //现在测试，暂时关闭
                    throw new  \Exception('暂无该项目的统计信息!');
                }

                $get_items_user_siteid = 0; //用户的siteid
                $get_items_company_siteid = 0;     //公司的siteid       
                //找用户
                $param_user_items_dirname = 'user_'. $get_items['user_id'];
                $get_items_user_siteid_data = Db::table('matomo_site')->where('items_dirname', $param_user_items_dirname )->field('idsite,company_siteid')->find();//查找公司siteid
                
                if (empty($get_items_user_siteid_data)) { //证明之前该用户没有项目,去创建用户siteid
                    //先找公司
                    $param_company_items_dirname = 'company_'. $get_items['company_id'];
                    $get_items_company_siteid_data = Db::table('matomo_site')->where('items_dirname', $param_company_items_dirname )->field('idsite')->find();//查找公司siteid
                    
                    if (empty($get_items_company_siteid_data)) { //证明之前该公司没有项目,去创建公司siteid
                        $add_company_siteid_data = [
                            'name' => $param_company_items_dirname,
                            'main_url' => $param_company_items_dirname,
                            'ts_created' => date('Y-m-d H:i:s'),
                            'sitesearch' => 1,
                            'ecommerce' => 0,
                            'timezone' => 'Asia/Shanghai',
                            'currency' => 'CNY',
                            'exclude_unknown_urls' => 0,
                            'keep_url_fragment' => 0,
                            'type' => 'website',
                            'creator_login' => 'admin',
                            'items_dirname' => $param_company_items_dirname,
                        ];
                         $get_items_company_siteid = Db::table('matomo_site')->insertGetId($add_company_siteid_data);
                    } else {
                        $get_items_company_siteid = $get_items_company_siteid_data['idsite'];
                        
                    }

                    $add_user_siteid_data = [
                        'name' => $param_user_items_dirname,
                        'main_url' => $param_user_items_dirname,
                        'ts_created' => date('Y-m-d H:i:s'),
                        'sitesearch' => 1,
                        'ecommerce' => 0,
                        'timezone' => 'Asia/Shanghai',
                        'currency' => 'CNY',
                        'exclude_unknown_urls' => 0,
                        'keep_url_fragment' => 0,
                        'type' => 'website',
                        'creator_login' => 'admin',
                        'items_dirname' => $param_user_items_dirname,
                        'company_siteid' => $get_items_company_siteid,
                    ];
                   $get_items_user_siteid = Db::table('matomo_site')->insertGetId($add_user_siteid_data);

                } else {
                    $get_items_user_siteid = $get_items_user_siteid_data['idsite'];
                    $get_items_company_siteid = $get_items_user_siteid_data['company_siteid'];
                }

                $add_items_data = [
                    'name' => $entity['items_dirname'],
                    'main_url' => $entity['items_dirname'],
                    'ts_created' => date('Y-m-d H:i:s'),
                    'sitesearch' => 1,
                    'ecommerce' => 0,
                    'timezone' => 'Asia/Shanghai',
                    'currency' => 'CNY',
                    'exclude_unknown_urls' => 0,
                    'keep_url_fragment' => 0,
                    'type' => 'website',
                    'creator_login' => 'admin',
                    'items_dirname' => $entity['items_dirname'],
                    'company_siteid' => $get_items_company_siteid,
                    'user_siteid' => $get_items_user_siteid,
                    'user_id' => $get_items['user_id'],
                    'company_id' => $get_items['company_id'],
                ];
                $get_data_id = Db::table('matomo_site')->insert($add_items_data);

                if (empty($get_data_id) && $get_data_id <= 0) {
                    throw new \Exception('add is failure');
                }

                 $get_data = Db::table('matomo_site')->where('items_dirname',$entity['items_dirname'])->field('idsite,items_dirname,company_siteid,user_siteid')->find();
                if (empty($get_data)) { //插入失败
                    throw new \Exception('get data is failure');
                } 

            } else {

            }
            $get_site_data = [
                                'idsite' => $get_data['idsite'],
                                'company_siteid' => $get_data['company_siteid'],
                                'user_siteid' => $get_data['user_siteid'],
                                'items_dirname' => $get_data['items_dirname'],
                            ];
            $return_data = array(
                'data' => $get_site_data,
                'message' => 'get siteid success!',
                'code' => 200,
            );
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }
        return $return_data;
    }

    /* public function getSite_asdff($entity){

        $return_data = array(
            'data'=>[],
            'message'=>'',
            'code'=>201,
        );

        try{

       
            $get_data = [];
            $get_data = Db::table('matomo_site')->where('items_dirname',$entity['items_dirname'])->field('idsite,items_dirname')->find();//查找项目id

            if(empty($get_data)){//证明没有，所有需要插入
                $add_data = [
                    'name'=>$entity['items_dirname'],
                    'main_url'=> $entity['items_dirname'],
                    'ts_created'=>date('Y-m-d H:i:s'),
                    'sitesearch'=>1,
                    'ecommerce'=>0,
                    'timezone'=>'Asia/Shanghai',
                    'currency'=>'CNY',
                    'exclude_unknown_urls'=>0,
                    'keep_url_fragment'=>0,
                    'type'=>'website',
                    'creator_login'=>'admin',
                    'items_dirname'=>$entity['items_dirname'],

                ];
                
                //先去找是否有该项目
                $get_items = Db::table('items')->where('dirname',$entity['items_dirname'])->field('id,dirname')->find();
                if(empty($get_items)){ //如果没有，就退出,
                   
                   $add_param_fsdfas2sdf1fds = [
                       'items_dirname' =>$entity['items_dirname'],
                       'time'=>date("Y-m-d H:i:s") ,
                   ];
                   Db::table('test_save_no_items')->insert($add_param_fsdfas2sdf1fds);

                   //throw new \Exception('no the items!'); //现在测试，暂时关闭
                }

                $get_data_id = Db::table('matomo_site')->insert($add_data);

                if(empty($get_data_id) && $get_data_id<=0){
                    throw new \Exception('add is failure');
                }

                

                 $get_data = Db::table('matomo_site')->where('items_dirname',$entity['items_dirname'])->field('idsite,items_dirname')->find();
                if(empty($get_data)){ //插入失败
                    throw new \Exception('get data is failure');
                } 

            }

            $get_site_data = [
                'idsite'=>$get_data['idsite'],
                'items_dirname'=>$get_data['items_dirname'],
            ];

            $return_data = array(
                'data'=>$get_site_data,
                'message'=>'get siteid success!',
                'code'=>200,
            );
        }catch(\Exception $e){
            $return_data = array(
                'data'=>[],
                'message'=>$e->getMessage(),
                'code'=>401,
            );
        }
        return $return_data;


    } */

    //保存项目的最新访问时间(准备停用)
    public function most_new_visit_time() {
        echo 200;
        exit;
        $return_data = array(
            'data' => [],
            'message' => '',
            'code' => 201,
        );

        try{
            $entity = input('param.');

            if (empty($entity['items_dirname'])) {
                throw new \Exception('items_dirname is need!');
            }

            $modelItems = new ItemsAs();
            $param_up_time = [];
            $param_up_time['where']['dirname'] = $entity['items_dirname'];
            $param_up_time['field']['most_new_visit_time'] = time();
            $get_data = $modelItems->up($param_up_time);

            if ($get_data['code'] == 200) {
                $return_data = array(
                    'data' => [],
                    'message' => 'save most_new_visit success',
                    'code' => 200,
                );
            } else {
                throw new \Exception($get_data['info']);
            }

            //项目的访问ip的信息
            try{ 
              
                $a =  new \app\statistics\controller\Manipulation();
                $result = $a->addVisitorIp($entity['items_dirname']);
              
            } catch (\Exception $e3) {
                
            }

        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }

        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    //保存项目的最新访问时间（内部调用）
    public function save_most_new_visit_time($entity = []) {
        $get_pv_data = [];//测试用
        $addVisitorIp_result = [];//测试用
        $return_data = array(
            'data' => [],
            'message' => '',
            'code' => 201,
        );

        try{
            //$entity = input('param.');
            if (empty($entity['items_dirname'])) {
                throw new \Exception('items_dirname is need!');
            }
            $modelItems = new ItemsAs();
            $param_up_time = [];
            $param_up_time['where']['dirname'] = $entity['items_dirname'];
            $param_up_time['field']['most_new_visit_time'] = time();
            $get_data = $modelItems->up($param_up_time);

            //项目的访问ip的信息
            try{ 
                $a =  new \app\statistics\controller\Manipulation();
                $addVisitorIp_result = $a->addVisitorIp($entity['items_dirname']);
            } catch (\Exception $e3) {
                
            }

            $get_pv_data = $this->add_items_pv(['items_dirname' => $entity['items_dirname']]); //添加浏览pv
            
            if ($get_data['code'] == 200) {
                $return_data = array(
                    'data' => [
                        'get_pv_data' => $get_pv_data, //测试
                        'addVisitorIp_result' => $addVisitorIp_result, //测试
                    ],
                    'message' => 'save most_new_visit success',
                    'code'=> 200,
                );
            } else {
                throw new \Exception($get_data['info']);
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

    //项目增加pv ，内部调用
    public function add_items_pv($entity = '') {
        $return_data = array(
            'data' => [],
            'message' => '',
            'code' => 201,
        );

        try{
            //$entity = input('param.');
            if (empty($entity['items_dirname'])) {
                throw new \Exception('items_dirname is need!');
            }

            Db::table('items')->where('dirname', $entity['items_dirname'])->setInc('pv', 1); //浏览加 1
            $return_data = array(
                'data' => [],
                'message' => 'ad pv is success!',
                'code' => 200,
            );
        } catch (\Exception $e) {
            $return_data = array(
                'data' => [],
                'message' => $e->getMessage(),
                'code' => 401,
            );
        }

        return $return_data ;
    }

    //获取最新的项目的访问时间
    /** 
     * $entity['get_data_type'] = company,user,items
    */
//    public function get_most_new_visit_time() {
//        $return_data = array(
//            'data' => [],
//            'message' => '',
//            'code' => 201,
//        );
//
//        try{
//            $entity = input('param.');
//
//            if (empty($entity['get_data_type'])) { //如果有该参数可能是user或者company的数据,或者items
//                $entity['get_data_type'] = 'items';
//            } else {
//                if ($entity['get_data_type']  == 'items' || $entity['get_data_type']  == 'user' ||  $entity['get_data_type']  == 'company') {
//
//                } else {
//                    throw new \Exception('填写的 get_data_type "'.$entity['get_data_type']  .'"  有误');
//                }
//            }
//
//            $param_get_time = [];
//           // $entity['_'] = '5d44b0f9529322dbdb72289bef206447';
//            if ($entity['get_data_type'] != 'items') {
//
//                if (!empty($entity['_'])) {
//
//                    $userData = Token::getUserGreps(['key_name' => $entity['_']]);
//                    if ($entity['get_data_type'] == 'company'){
//
//                        $param_get_time['where']['company_id'] =  $userData['company_id'];
//                    } else if ($entity['get_data_type'] == 'user') {
//                        $param_get_time['where']['user_id'] =  $userData['user_id'];
//                    }
//                } else {
//                    throw new \Exception('请添加token');
//                }
//
//            } else {
//
//                if (empty($entity['items_dirname'])) {
//                    throw new \Exception('items_dirname is need!');
//                }
//
//                $param_get_time['where']['dirname'] = $entity['items_dirname'];
//            }
//            //$param_get_time['field'] = ['most_new_visit_time'];
//            $get_data = [];
//            $get_data = Db::table('items')->where('most_new_visit_time', '>', 0)->where($param_get_time['where'])->order('most_new_visit_time desc')->limit(5)->field('id,dirname as items_dirname,most_new_visit_time,title,marker_image')->select();//->($param_get_time);
//            $return_message = 'get  data empty';
//            $return_data = array(
//                    'data' => [],
//                    'message' => $return_message,
//                    'code' => 200,
//            );
//
//            if (!empty($get_data)) {
//                $today_date_int =  date("Ymd" ,time()); //今天日期
//                foreach ($get_data as $kkk => $vvv) {
//                    $get_data[$kkk]['most_new_visit_date'] = date( "Y-m-d H:i:s", $vvv['most_new_visit_time']);
//                    $get_data[$kkk]['most_new_visit_time'] = $vvv['most_new_visit_time'] . "000" ;//返回给前端的时间戳
//
//                    $data_fdskjfnjsdnf = new Data();
//                    //$entity_pafdsfsdf = $entity;
//                    $entity_pafdsfsdf = [];
//                    $entity_pafdsfsdf['items_dirname'] = $vvv['items_dirname'];
//                    $get_visite_data  = $data_fdskjfnjsdnf->to_get_VisitsSummary_getVisits($entity_pafdsfsdf);
//                    $where_param = [
//                        'opreation_date' => $today_date_int,
//                        'items_dirname' => $vvv['items_dirname'],
//                    ];
//                    // 获取当天的点赞
//                    $today_praise = 0;
//                    $get_today_praise = Db::table('items_praise')->where($where_param)->field('praise_sum')->find();
//
//                    if (!empty($get_today_praise)) {
//                        $today_praise = $get_today_praise['praise_sum'];
//                    }
//
//                    $get_data[$kkk]['praise_sum'] =  $today_praise; //点赞数
//                   // dump( $get_today_praise);
//                     // 获取当天的评论
//                     $today_comment_sum = 0;
//                     $get_today_comment = Db::table('items_comment_changyan')->where($where_param)->field('comment_sum')->find();
//                     if (!empty($get_today_comment)) {
//                         $today_comment_sum = $get_today_comment['comment_sum'];
//                     }
//                     $get_data[$kkk]['comment_sum'] =  $today_comment_sum; //评论数
//                  //  dump( $get_today_comment);
//                     // 获取当天的分享
//                     $today_share_sum = 0;
//                     $get_today_share = Db::table('items_share')->where($where_param)->field('sum')->find();
//
//                     if (!empty($get_today_share)) {
//                         $today_share_sum = $get_today_share['sum'];
//                     }
//
//                     $get_data[$kkk]['share_sum'] =  $today_share_sum; //分享数
//                     //dump( $get_today_share);
//
//                    if ($get_visite_data['code'] == 200) {
//                        $get_data[$kkk] = array_merge($get_data[$kkk], $get_visite_data['data']);
//                    } else {
//                        throw new \Exception($get_visite_data['message']);
//                    }
//                }
//
//                $return_data['data'] =  $get_data;
//                $return_data['message'] = '获取'.$entity['get_data_type']. ' 成功';
//            }
//
//        } catch (\Exception $e) {
//            $return_data = array(
//                'data' => [],
//                'message' => $e->getMessage(),
//                'code' => 401,
//            );
//        }
//
//        echo json_encode($return_data, JSON_UNESCAPED_UNICODE);
//        exit;
//    }

    /**
     * 获取最新的项目的访问时间
     * @return false|string
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     * @author tanhuaxin
     */
    public function get_most_new_visit_time()
    {
        $entity = input('');
        $res = $this->checkGetDataType($entity);
        if ($res['msg']) {
            return json_return(1, $res['msg']);
        } else {
            $cacheIndex = 'most_new_visit_time' . $entity['get_data_type'] . '_'; //缓存名
            $where['most_new_visit_time'] = array('gt', 0);
            if ($entity['get_data_type'] == 'company') {
                $where['company_id'] = $res['data']['company_id'];
                $cacheIndex .= $res['data']['company_id'];
            } else if ($entity['get_data_type'] == 'user') {
                $where['user_id'] = $res['data']['user_id'];
                $cacheIndex .= $res['data']['user_id'];
            } else {
                $where['dirname'] = $entity['items_dirname'];
                $cacheIndex .= $entity['items_dirname'];
            }

            //获取缓存
            $get_cache_data = cache($cacheIndex);
            if ($get_cache_data) {
                $get_data = json_decode($get_cache_data, true);
            } else {
                $get_data = Db::table('items')->field('id,dirname as items_dirname,most_new_visit_time,title,marker_image')->where($where)->order('most_new_visit_time desc')->limit(5)->select();
                if ($get_data) {
                    $today_date_int = date("Ymd", time()); //今天日期
                    $data_fdskjfnjsdnf = new Data();
                    foreach ($get_data as $kkk => $vvv) {
                        $get_data[$kkk]['most_new_visit_date'] = date("Y-m-d H:i:s", $vvv['most_new_visit_time']);
                        $get_data[$kkk]['most_new_visit_time'] = $vvv['most_new_visit_time'] . "000";//返回给前端的时间戳

                        //访问量
                        $entity_pafdsfsdf['items_dirname'] = $vvv['items_dirname'];
                        $get_visite_data = $data_fdskjfnjsdnf->to_get_VisitsSummary_getVisits($entity_pafdsfsdf);
                        $where_param = [
                            'opreation_date' => $today_date_int,
                            'items_dirname' => $vvv['items_dirname'],
                        ];

                        // 获取当天的点赞
                        $get_today_praise = Db::table('items_praise')->where($where_param)->field('praise_sum')->find();
                        $get_data[$kkk]['praise_sum'] = $get_today_praise['praise_sum'] ?: 0; //点赞数

                        // 获取当天的评论
                        $get_today_comment = Db::table('items_comment_changyan')->where($where_param)->field('comment_sum')->find();
                        $get_data[$kkk]['comment_sum'] = $get_today_comment['comment_sum'] ?: 0; //评论数

                        // 获取当天的分享
                        $get_today_share = Db::table('items_share')->where($where_param)->field('sum')->find();
                        $get_data[$kkk]['share_sum'] = $get_today_share['sum'] ?: 0; //分享数

                        $get_data[$kkk] = array_merge($get_data[$kkk], $get_visite_data['data']);
                    }
                }
                //缓存数据
                cache($cacheIndex, json_encode($get_data), 300); //暂时缓存5分钟
            }

            return json_return(200, 'success', $get_data);
        }
    }

    //获取最新的总发布的项目数
    /** 
     * $entity['get_data_type'] = company,user,items
    */
   /*  public function items_send_sum(){
       
        

        $return_data = array(
            'data' => [],
            'message' => '',
            'code'=> 201,
        );

        try{
            $entity = input('param.');


            if(empty($entity['get_data_type'])){ //如果有该参数可能是user或者company的数据,或者items
                throw new \Exception('请添加 get_data_type');
            
            }else{
                if(  $entity['get_data_type']  == 'user' ||  $entity['get_data_type']  == 'company'){
                    
                }else{
                    throw new \Exception('填写的 get_data_type "'.$entity['get_data_type']  .'"  有误');
                }
            }

           
            //$entity['_'] = '5d44b0f9529322dbdb72289bef206447';

           
            if(!empty($entity['_'])){
                $userData = Token::getUserGreps(['key_name' => $entity['_']]);
                if($entity['get_data_type'] == 'company'){
                    $param_get_sum['where']['company_id'] =  $userData['company_id'];
                }else if($entity['get_data_type'] == 'user'){
                    $param_get_sum['where']['user_id'] =  $userData['user_id'];
                }
            }else{
                throw new \Exception('请添加token');
            }
            
            
            $get_data = [];
            $get_data = Db::table('items')->where($param_get_sum['where'] )->count();//->($param_get_time);

            

            
            
            $items_count = 0 ;
            if(!empty($get_data)){
                $items_count = $get_data ;
            }
            $return_data = array(
                    'data' => [
                        'items_count' => $items_count ,
                    ],
                    'message' =>   'get items_count success!',
                    'code'=> 200,
            );

            
           
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
    
    public function test_praise() {
        $dirname = input('param.dirname');
        $get_data = Db::table('items')->where(['dirname' => $dirname])->field('id,dirname,praise')->find();
        dump($get_data);
        dump(com_this_week_time());
    }




}