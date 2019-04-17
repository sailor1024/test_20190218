<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/11/7
 * Time: 10:56
 */

namespace app\index2\model;

use think\Exception;
use think\Model;
use think\Db;
use app\index2\model\User;
use app\index2\model\Items;
use app\index2\model\InviteCooperator;

class Index extends Model
{


    // 构造函数
    protected function initialize()
    {
        parent::initialize();

    }


    /**
     * 获取一组记录的id
     */
    public function getListId($param)
    {


        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }

        //分页,page_num:从那条开始，limit_num：限制一次多少条
        $limit_num = !empty($param['where']['limit_num']) ? $param['where']['limit_num'] : 10;
        $page = !empty($param['where']['page']) ? $param['where']['page'] : 1;
        if ($page == '') {
            $page_num = 0;
        } else {
            $page_num = $limit_num * ($page - 1);
        }


        if (empty($param['where'])) {
            // return ['code' => 401, 'info' => $array];
        }
        $type = !empty($param['where']['type']) ?  $param['where']['type'] : 2 ;//2是按时间倒叙
        if($type == 1){ // 名称

           $order_type = " name  asc";
        }else { 
           $order_type = " create_time  desc";
        }

        switch ($param['where']['user_type']) {
            
            case 1 ://管理员
            case 2 ://管理员
            //http://localhost/test_3/20181108/new_todo/todo.kangyun3d.cn/public/index.php/index2/index/space_list?company_id=55&dir_father_id=0&items_dir_id=0&limit_num=10&page=2&type=1&user_id=1&user_type=3
                $sql = "
                    select * from(  
                    (select dir_name as name,id,user_id,is_table,create_time from items_dir where dir_father_id = '" . $param['where']['dir_father_id'] . "' and company_id = '" . $param['where']['company_id'] . "'  and valid = 1  )  
                    union all
                    (select title as name,id,user_id,is_table,create_time from items where items_dir_id = '" . $param['where']['dir_father_id'] . "' and company_id = '" . $param['where']['company_id'] . "'   and valid = 1    )   order by is_table asc , ". $order_type." 
                    ) as c    limit " . $page_num . "," . $limit_num ." ";
                break;
            case 3://合作者
                    $where_or_share_dir = " ";
                    $where_or_share_items = " ";
                    if(!empty($param['where_or']['share_dir'] ) ){
                        
                       $temp = implode( ',',$param['where_or']['share_dir']);//[1,2,3,4]=> 1,2,3,4

                        $where_or_share_dir = " or ( id in ( ".$temp." )    and company_id = '" . $param['where']['company_id'] . "'  and valid = 1 ) ";
                    }
                   
                    if(!empty($param['where_or']['share_items'] ) ){
                        $temp = implode( ',',$param['where_or']['share_items']);//[1,2,3,4]=> 1,2,3,4
                        $where_or_share_items = " or ( id in ( ".$temp." )  and  company_id = '" . $param['where']['company_id'] . "'   and valid = 1    )";
                    }

                    if($param['where']['dir_father_id'] == 0){ //不能直接找father——id =0
                        $sql = "
                            select * from( 
                                (select id,dir_name as name,user_id,is_table,create_time from items_dir where ( high_floor = 1  and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1 ) ".$where_or_share_dir."  )
                                union all
                                (select id,title as name,user_id,is_table,create_time from items where (high_floor = 1   and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "' and valid = 1)   ".$where_or_share_items." )  order by is_table asc , ". $order_type." 
                                ) as c  limit " . $page_num . "," . $limit_num;
                       /*  $sql = "
                            select * from( 
                                (select id,user_id,is_table from items_dir where ( high_floor = 1  and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1 )   )
                                union all
                                (select id,invite_user_id as user_id,is_table from invite_cooperator where father_id ='" . $param['where']['dir_father_id'] . "' and invite_user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1   order by is_dir_items asc)
                                UNION all
                                (select id,user_id,is_table from items where high_floor = 1   and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "' and valid = 1    )
                                ) as c  limit " . $page_num . "," . $limit_num; */
                                
                        
                    }else{
                        $sql = "
                            select * from( 
                                (select id,dir_name as name,create_time,user_id,is_table from items_dir where (dir_father_id ='" . $param['where']['dir_father_id'] . "' and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1)  ".$where_or_share_dir."  )
                                union all
                                (select id,title as name,create_time,user_id,is_table from items where  (items_dir_id ='" . $param['where']['dir_father_id'] . "'  and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "' and valid = 1 )   ".$where_or_share_items." )  order by is_table asc , ". $order_type." 
                                ) as c  limit " . $page_num . "," . $limit_num;

                        /* $sql = "
                            select * from( 
                                (select id,user_id,is_table from items_dir where dir_father_id ='" . $param['where']['dir_father_id'] . "' and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1  )
                                union all
                                (select id,invite_user_id as user_id,is_table from invite_cooperator where father_id ='" . $param['where']['dir_father_id'] . "' and invite_user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "' and valid = 1   order by is_dir_items asc)
                                UNION all
                                (select id,user_id,is_table from items where items_dir_id ='" . $param['where']['dir_father_id'] . "'  and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "' and valid = 1    )
                                ) as c  limit " . $page_num . "," . $limit_num; */
                    }
                

                break;
        }


        if ($array = Db::query($sql)) {
            return $array;
        }
        return $array;

    }

    /**
     * 获取一组记录的的总数
     */
    public function getListIdCount($param)
    {


        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }


        if (empty($param['where'])) {
            // return ['code' => 401, 'info' => $array];
        }

        switch ($param['where']['user_type']) {

            case 1 ://管理员
            case 2 ://管理员

                $sql = "
                    select count(*) from( 
                    (select  id from items_dir where dir_father_id ='" . $param['where']['dir_father_id'] . "'  and company_id='" . $param['where']['company_id'] . "'  and valid = 1 )
                    union all
                    (select  id from items where items_dir_id ='" . $param['where']['dir_father_id'] . "' and company_id='" . $param['where']['company_id'] . "'   and valid = 1 )
                    ) as c ";

                break;
            case 3://合作者
                if($param['where']['dir_father_id'] == 0){ //不能直接找father——id =0
                        $sql = "
                        select  count(*) from( 
                        (select id  from items_dir where  high_floor = 1  and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "'  and valid = 1  )
                        union all
                        (select  id from invite_cooperator where high_floor = 1  and invite_user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "'  and valid = 1  )
                        UNION all
                        (select id from items where   high_floor = 1  and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "'  and valid = 1    )
                        ) as c  ";
                        
                }else{
                    $sql = "
                                        select  count(*) from( 
                                        (select id  from items_dir where dir_father_id ='" . $param['where']['dir_father_id'] . "' and user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "'  and valid = 1  )
                                        union all
                                        (select  id from invite_cooperator where father_id ='" . $param['where']['dir_father_id'] . "' and invite_user_id = '" . $param['where']['user_id'] . "'  and company_id='" . $param['where']['company_id'] . "'  and valid = 1  )
                                        UNION all
                                        (select id from items where items_dir_id ='" . $param['where']['dir_father_id'] . "'  and user_id  = '" . $param['where']['user_id'] . "'   and company_id='" . $param['where']['company_id'] . "'  and valid = 1    )
                                        ) as c  ";

                }        
                
                break;
        }


        if ($array = Db::query($sql)) {
            return $array;
        }
        return $array;


    }


    /**
     * 获取items_dir表的多条数据
     *
     */
    public function getItemsDirList($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }


        $where = [];
        $field = [];
        $order = [];
        if (!empty($param['where'])) {
            $where = $param['where'];
        }
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if (!empty($param['order'])) {
            $order = $param['order'];
            
        }


        if ($array = Db::name("items_dir")->where($where)->field($field)->order($order)->select()) {
            return $array;
            //return ['code' => 200, 'info' => $array];
        }
        return $array;
        //return ['code' => 401, 'info' => $array];

    }

    /**
     * 获取items表的多条数据
     */
    public function getItemsList($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }


        $where = [];
        $field = [];
        $order = [];
        if (!empty($param['where'])) {
            $where = $param['where'];
        }
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if (!empty($param['order'])) {
            $order = $param['order'];
            
        }


        if ($array = Db::name("items")->where($where)->field($field)->order($order)->select()) {
            return $array;
        }
        return $array;
        //return ['code' => 401, 'info' => $array];

    }

    /**
     * 获取invite_coop表的多条数据
     *  */
    public function getInviteCoop($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }


        $where = [];
        $field = [];
        $order = [];
        if (!empty($param['where'])) {
            $where = $param['where'];
        }
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if (!empty($param['order'])) {
            $order = $param['order'];
        }


        if ($array = Db::name("invite_cooperator")->where($where)->field($field)->select()) {
            return $array;
        }
        return $array;

    }



    /**数据中间层**/
    /**
     * 首页的空间列表
     **/
    public function spaceList($param)
    {

        /*
        http://localhost/test_3/20181108/new_todo/todo.kangyun3d.cn/public/index.php/index2/index/space_list?
        company_id=1&dir_father_id=0&items_dir_id=0&limit_num=10&page=1&type=2&user_id=1&user_type=4

        http://localhost/test_3/20181108/new_todo/todo.kangyun3d.cn/public/index.php/index2/index/space_list?company_id=1&dir_father_id=0&items_dir_id=0&limit_num=10&page=1&type=2&user_id=1&user_type=3
        */
        $array = [
            'dir' => ['data' => []],
            'items' => ['data' => []],
            'count' => 0,
            'parent_name' => '',
            'edit_type' => 2,
            'all_path' =>[]
        ];
        if (!is_array($param)) {
            return ['code' => 401, 'message' => lang('no_array'), 'data' => $array];
        }

        $parent_name = '全部项目';
        $all_path =array(
            [
                'path_id' => 0,
                'path_name' =>'首页',
            ],
        );
        if($param['dir_father_id'] >0){ //获取某文件夹的名称
            $temp_get_fatehr_message = Db::name('items_dir')->where('id',$param['dir_father_id'])->field('dir_name,user_id,path')->find();
            $parent_name = $temp_get_fatehr_message['dir_name'];
            
            //增加面包屑
            $all_path_id = explode('-',$temp_get_fatehr_message['path']);
            $all_path_name = Db::name('items_dir')->where('id','in',$all_path_id)->where('valid',1)->field('dir_name,id,user_id')->select();
            foreach($all_path_id as $v){
                foreach($all_path_name  as $v2){
                    if($v == $v2['id']){
                    
                       $temp = [];
                       if($param['user_type'] == 3 ){
                            if($v2['user_id'] == $param['user_id']){ //证明是自己的
                                $temp['path_id'] = $v2['id'];
                                $temp['path_name'] = $v2['dir_name'];
                            }else{
                                $temp_get_coop_message = Db::name('invite_cooperator')
                                    ->where('company_id',$param['company_id'])
                                    ->where('invite_user_id',$param['user_id'])
                                    ->where('items_dir_id',$v2['id']) //文件夹id
                                    ->where('valid',1) 
                                    ->find();

                                if(!empty($temp_get_coop_message)){ //证明有被邀请
                                    $temp['path_id'] = $v2['id'];
                                    $temp['path_name'] = $v2['dir_name']; 
                                }else{
                                    break;
                                }
                            }
                       }else{
                            $temp['path_id'] = $v2['id'];
                            $temp['path_name'] = $v2['dir_name'];
                       }
                       if(!empty($temp)){
                            $all_path[] = $temp;
                       }
                       
                       break;
                    }
                    
                }

            }
            
            
            //获取合作者对该文件夹的操作权限
            if($temp_get_fatehr_message['user_id'] != $param['user_id'] &&  $param['user_type'] == 3 ){ //不是自己的,
                $temp_get_father_edit = Db::name('invite_cooperator')->where(['invite_user_id'=>$param['user_id'], 'company_id' => $param['company_id'],  'valid' => 1, 'items_dir_id' => $param['dir_father_id']  ])->field('id,edit_type')->find();
                if(empty($temp_get_father_edit)){
                    //return ['code' => 401, 'message' => '权限不足！', 'data' => $array]; //没有该文件夹的管理权限
                }else{
                    if($temp_get_father_edit['edit_type'] == 1){ //可以查看
                        $array['edit_type'] = 1;
                    }
                }
            } 
            unset($temp_get_fatehr_message);

        }
        $array['parent_name'] = $parent_name;
        $array['all_path'] = $all_path;


        $param1 = [];
        $param1['where']['user_type'] = $param['user_type'];
        $param1['where']['company_id'] = $param['company_id'];
        $param1['where']['dir_father_id'] = $param['dir_father_id'];
        $param1['where']['limit_num'] = $param['limit_num'];
        $param1['where']['user_id'] = $param['user_id'];
        $param1['where']['page'] = !empty($param['page']) ? $param['page'] : 1;
        $param1['where']['type'] = !empty($param['type']) ? $param['type'] : 2; //按时间
        $param1['where_or']['dir'] = [];
        $param1['where_or']['items'] = [];   
        
        


        

        //文件与文件夹列表的总条数
        $getListCount = $this->getListIdCount($param1)[0]['count(*)'];

        if ($getListCount == 0) { //没有数据
            return ['code' => 200, 'message' => ' count is empty', 'data' => $array];
        }

        //先判断用户类型
        
        $temp_coop_share_dir = [];
        $temp_coop_share_items = [];
        if($param['user_type'] == 3 ){
            $temp_coop_share_id = [];
            $_param_get_coop = [];
            $_param_get_coop['where']['invite_user_id'] = $param['user_id'];
            $_param_get_coop['where']['company_id'] = $param['company_id'];
            $_param_get_coop['where']['valid'] = 1;
            if($param['dir_father_id'] == 0){
                $_param_get_coop['where']['high_floor'] = 1;
            }else{
                $_param_get_coop['where']['father_id'] = $param['dir_father_id'];
            }
            $_param_get_coop['field'] = ['id,items_dir_id,items_id,edit_type'] ;
            $temp_coop_share_id = $this->getInviteCoop($_param_get_coop);
           
            if(!empty($temp_coop_share_id)){
                $temp_coop_share_dir_id = [];
                $temp_coop_share_items_id = [];
                foreach($temp_coop_share_id as $v2){
                    if($v2['items_dir_id'] != 0){ //证明是文件夹

                        $temp_coop_share_dir_id[] = $v2['items_dir_id'];  
                        $temp_1['id'] = $v2['items_dir_id'];
                        $temp_1['edit_type'] = $v2['edit_type'];
                        $temp_coop_share_dir[] = $temp_1;  

                    }else if($v2['items_id'] != 0){ //证明是项目

                        $temp_coop_share_items_id[] = $v2['items_id'];
                        $temp_2['id'] = $v2['items_id']; 
                        $temp_2['edit_type'] = $v2['edit_type']; 
                        $temp_coop_share_items[] = $temp_2;
                        
                    }

                }
                $param1['where_or']['share_dir'] = $temp_coop_share_dir_id;
                $param1['where_or']['share_items'] = $temp_coop_share_items_id;
                
            }
            

            
        }


        $getListId = $this->getListId($param1);//获取文件夹与文件id组
       

        $getItemsDirId = [];   //文件夹
        $getInviteCoopId = []; //邀请表的文件与文件
        $getInviteCoopItems = []; //邀请表的文件
        $getInviteCoopItemsDir = []; //邀请表的文件夹
        $getItemsId = [];  //文件
        $getItemsList = [];  //文件列表
        $getItemsDirList = [];  //文件夹列表

        
        foreach ($getListId as $v) {

            if ($v['is_table'] == 1) { //文件夹表
                $getItemsDirId[] = $v['id'];
            } /* else if ($v['is_table'] == 2) { //邀请表
                $getInviteCoopId[] = $v['id'];

            } */ else if ($v['is_table'] == 3) {//项目表
                $getItemsId[] = $v['id'];
            }

        }

        /* if (!empty($getInviteCoopId)) { //分享给合作者的文件夹与项目
            $entity = [];
            $entity['field'] = ['edit_type', 'items_dir_id', 'items_id', 'path', 'father_id'];
            $entity['where']['id'] = ['in', $getInviteCoopId];
            $getInviteCoop = $this->getInviteCoop($entity);
            foreach ($getInviteCoop as $v) {
                if ($v['items_dir_id'] == 0) { //不是文件夹,是文件
                    $getItemsId [] = $v['items_id'];


                    //下面给邀请的项目需要用到
                    $temp_items['id'] = $v['items_id'];
                    $temp_items['path'] = $v['path'];
                    $temp_items['edit_type'] = $v['edit_type'];

                    $getInviteCoopItems[] = $temp_items;


                } else {
                    $getItemsDirId [] = $v['items_dir_id'];

                    //下面给邀请的文件夹需要用到
                    $temp_items_dir['id'] = $v['items_dir_id'];
                    $temp_items_dir['path'] = $v['path'];
                    $temp_items_dir['edit_type'] = $v['edit_type'];

                    $getInviteCoopItemsDir[] = $temp_items_dir;

                }


            }
            // dump($getInviteCoop);
        } */

        /* if (!empty($temp_coop_share_id)) { //分享给合作者的文件夹与项目
           
            foreach ($temp_coop_share_id as $v) {
                if ($v['items_dir_id'] == 0) { //不是文件夹,是文件
                    $getItemsId [] = $v['items_id'];


                    //下面给邀请的项目需要用到
                    $temp_items['id'] = $v['items_id'];
                    $temp_items['path'] = $v['path'];
                    $temp_items['edit_type'] = $v['edit_type'];

                    $getInviteCoopItems[] = $temp_items;


                } else {
                    $getItemsDirId [] = $v['items_dir_id'];

                    //下面给邀请的文件夹需要用到
                    $temp_items_dir['id'] = $v['items_dir_id'];
                    $temp_items_dir['path'] = $v['path'];
                    $temp_items_dir['edit_type'] = $v['edit_type'];

                    $getInviteCoopItemsDir[] = $temp_items_dir;

                }


            }
            // dump($getInviteCoop);
        }
        */

        if (!empty($getItemsDirId)) { //有文件夹
            $entity3 = [];
            $entity3['field'] = ['id,dir_name,dir_father_id,items_num,user_id,company_id,path,create_time,update_time,valid,is_table'];
            $entity3['where']['id'] = ['in', $getItemsDirId];

            if($param1['where']['type'] == 1){ // 名称
                $order_type = 'dir_name asc'; //['order','id'=>'desc']
             }else { 
                $order_type = 'create_time desc';
            }

            $entity3['order'] = $order_type;
            
            $getItemsDirList = $this->getItemsDirList($entity3); //文件夹表
            // $items = new Items(); //获取子项目的个数
            for ($i = 0; $i < count($getItemsDirList); $i++) {
                $getItemsDirList[$i]['edit_type'] = 2;

                $items_num = Db::name('items')->where('valid',1)->where('items_dir_id', $getItemsDirList[$i]['id'])->count();//获取子项目的个数
                $getItemsDirList[$i]['items_num'] = $items_num;

                /* foreach ($getInviteCoopItemsDir as $v2) { //给合作者添加操作权限
                    if ($getItemsDirList[$i]['id'] == $v2['id']) {
                        $getItemsDirList[$i]['edit_type'] = $v2['edit_type'];
                        $getItemsDirList[$i]['path'] = $v2['path'];
                        break;
                    }

                } */
                foreach ($temp_coop_share_dir as $v2) { //给合作者添加操作权限
                    if ($getItemsDirList[$i]['id'] == $v2['id']) {
                        $getItemsDirList[$i]['edit_type'] = $v2['edit_type'];
                        //$getItemsDirList[$i]['path'] = $v2['path'];
                        break;
                    }

                }

            }


        }

        

        if (!empty($getItemsId)) { //有文件
            $entity2 = [];
            $entity2['field'] = ['id,company_id,items_dir_id,dirname,user_id,longitude,latitude,address,featured,title,location,detail_username,detail_presenter,detail_phone,detail_email,detail_link,website,category	,rating	,url,marker_image,additional_info,description,ribbon,video,marker_color,create_time,isshow_offica,isshow_bmap,sorts,update_time,edit_url,creator,valid,is_table'];
            $entity2['where']['id'] = ['in', $getItemsId];

            if($param1['where']['type'] == 1){ // 名称
                $order_type = 'title asc';
             }else { 
                $order_type = 'create_time desc';
            }
            $entity2['order'] = $order_type;

            $getItemsList = $this->getItemsList($entity2); //文件表
            /* if($param['user_type'] == 3){
                echo "<pre/>";
                print_r($getItemsList);
            } */
            for ($i = 0; $i < count($getItemsList); $i++) {
                $dirname = $getItemsList[$i]['dirname']; 
                $image_path = 'scanItems/path/'.$dirname.'/preview.png';
                $model_path = 'scanItems/path/'.$dirname.'/model.json';
                //查找marker_image,并添加 
                if(empty($getItemsList[$i]['marker_image'])){                
                                                                         
                    if(file_exists($model_path)){ //如果存在该图片，证明已经完成 
                        $getItemsList[$i]['marker_image'] = $image_path;             
                        Db::name('items')->where('id', $getItemsList[$i]['id'])->update(['marker_image' => $image_path]);                      
                    }                
                }else{
                    //有图片地址，当时也有可能被删了
                    //uploads/edit_file/8a2cee74dca7bd01f0c3d5984710d583/screen_images/jietu190413162667515cb19d50b75312002.png
                    if(file_exists( $getItemsList[$i]['marker_image'] ) === false){
                        if(file_exists($model_path)){ // preview.png
                            $getItemsList[$i]['marker_image'] = $image_path;                         
                            Db::name('items')->where('id', $getItemsList[$i]['id'])->update(['marker_image' => $image_path]);                             
                        }                 
                    }
                }

                $getItemsList[$i]['edit_type'] = 2;
                $getItemsList[$i]['create_time'] = $getItemsList[$i]['create_time'] * 1000;
                //$getItemsList[$i]['addtime'] = $getItemsList[$i]['create_time'] * 1000;
                $param2['where']['id'] = $getItemsList[$i]['user_id'];
                $param2['field'] = ['lastname,firstname'];

                //添加文件创建者名称
                $user = new User();
                $getUserName = $user->getArr($param2);//获取用户的信息

                if ($getUserName['code'] == 200) {
                    $getItemsList[$i]['lastname'] = $getUserName['info']['lastname'];
                    $getItemsList[$i]['firstname'] = $getUserName['info']['firstname'];

                }

                foreach ($temp_coop_share_items as $v2) { //给合作者添加操作权限
                    if ($getItemsList[$i]['id'] == $v2['id']) {
                        $getItemsList[$i]['edit_type'] = $v2['edit_type'];
                        //$getItemsList[$i]['path'] = $v2['path'];
                        break;
                    }

                }
            }


        }


        $array['dir']['data'] = $getItemsDirList;
        
        $array['items']['data'] = $getItemsList;
        $array['count'] = $getListCount;
        $array['parent_name'] = $parent_name;
        

        return ['code' => 200, 'data' => $array];


    }

    

    /**文件夹或项目合作者 */
    public function dirItemsCoop($param, InviteCooperator $inviteCooperator, User $user)
    {
        $array = [];
        $_param = [];
        $user_param = [];
        $coopUserList = [];//合作者列表
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }

        //判断是文件夹还是文件
        if ($param['is_dir_items'] == 1) { //文件夹
            $_param['where']['items_dir_id'] = $param['dir_items_id'];
        } else if ($param['is_dir_items'] == 2) {//项目
            $_param['where']['items_id'] = $param['dir_items_id'];
        }

        $_param['field'] = ['invite_user_id,edit_type,user_id'];


        $getCoopList = $inviteCooperator->getList($_param);
        if ($getCoopList['code'] == 200) {  //有数据

            foreach ($getCoopList['info'] as $v) {
                $temp = [];
                $temp['edit_type'] = $v['edit_type'];
                $temp['user_id'] = $v['user_id']; //邀请者idid
                $temp['invite_user_id'] = $v['invite_user_id']; //被邀请的合作者id

                $user_param['where']['id'] = $v['invite_user_id'];
                $user_param['field'] = ['lastname,firstname'];
                $user->getArr($user_param);

                $coopUserList[] = $temp;
            }

        } else {
            return ['code' => 401, 'info' => $array];
        }


    }

    public function invite_cooperator_list($entity)
    {

        if ($entity['project_id'] == '') {
            $where_inv = ['items_dir_id' => $entity['item_dir']];
        } else {
            $where_inv = ['items_id' => $entity['project_id']];
        }
        try {
            $inv_list = Db::name('invite_cooperator')
                ->where($where_inv)
                ->field('edit_type,invite_user_id')
                ->select();
        } catch (\Exception $e) {
            $res['message'] = $e->getMessage();
            $res['code'] = 500;
            return $res;
        }


        //        if (empty($inv_list)) {
        //            $res['message'] = 'not found any cooperator';
        //            $res['code'] = 200;
        //            $res['data'] = [];
        //            return $res;
        //        }

        $where_name = [];
        foreach ($inv_list as $k => $v) {
            $where_name[] = $v['invite_user_id'];
        }

        try {
            $name_list = Db::name('user')
                ->where('id', 'in', $where_name)
                ->where('user_type',3)
                ->field('id,firstname,lastname,decrypt_email')
                ->select();
        } catch (\Exception $e) {
            $res['message'] = $e->getMessage();
            $res['code'] = 500;
            return $res;
        }
        $nameList = [];
        foreach ($name_list as $k => $v) {
            $nameList[$k]['user_name'] = $v['lastname'] . $v['firstname'];
            $nameList[$k]['email'] = $v['decrypt_email'];
            foreach($inv_list as $ik=>$iv){
                if($iv['invite_user_id']===$v['id']){
                    $nameList[$k]['edit_type']=$iv['edit_type'];
                }
            }
        }


        return $nameList;

    }

    


}

?>

