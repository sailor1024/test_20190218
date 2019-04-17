<?php

namespace app\index2\model;

use think\Db;
use think\Exception;
use think\Model;

class Items extends Model
{
    protected $rule = [
        ['path', 'alphaDash', 'URL格式错误'],
        ['company_id', 'require|number|>:0', '所属公司id|数字型|大于0'],
        ['user_id', 'require|number|>:0', '创建者Id必须|数字型|大于0'],
        ['dirname', 'require|length:4,40|chsDash', '文件名称必须|名称最多不能超过40个且大于4个字符|数据类型错误'],
        ['items_dir_id', 'number|length:1,11', '数字型|长度1到11位'],
        ['longitude', 'require|float|>=:0', '经度必须|浮点型|大于0'],
        ['latitude', 'requir|float|>=:0', '维度必须|浮点型|大于0'],
        ['title', 'requir|length:2,60', '项目标题必须|最多不能超过60个且大于2个字符'],
        ['edit_url', 'requir|url', '编辑url必须|URL格式错误'],
        ['url', 'requir|url', '模型地址必须|URL格式错误'],
        ['create_time', 'require|number|>:0', '文件夹创建时间|数字型|大于0'],
        ['update_time', 'require|number|>:0', '文件夹更新时间|数字型|大于0'],
    ];
    //修改前验证
    protected $uprule = [
        ['path', 'alphaDash', 'URL格式错误'],
        ['company_id', 'number|>:0', '数字型|大于0'],
        ['user_id', 'number|>:0', '数字型|大于0'],
        ['dirname', 'length:4,40|chsDash', '名称最多不能超过40个且大于4个字符|数据类型错误'],
        ['items_dir_id', 'length:1,11', '长度1到11位'],
        ['longitude', 'float|>=:0', '浮点型|大于0'],
        ['latitude', 'float|>=:0', '浮点型|大于0'],
        ['title', 'length:2,60', '最多不能超过60个且大于2个字符'],
        ['edit_url', 'url', 'URL格式错误'],
        ['url', 'url', 'URL格式错误'],
        ['create_time', 'number|>:0', '数字型|大于0'],
        ['update_time', 'number|>:0', '数字型|大于0'],
    ];
    //主要调用的方法是
    /**
     *
     *
     * 1.index2/items/get_dir_tree()     主要是获取所有自己能管理的目录，用树杈的方式显示出来
     * 2.index2/items/get_dir_list()     主要是获取所有自己能管理的目录，用一维数组出来
     * 3.index2/items/get_dir_page()     主要是获取所有自己能管理的目录，已经做了父级目录限制，例如：当dir_father_id =0
     * 3.index2/items/get_items_list()   主要是获取所有自己能管理的项目，已经做了父级目录限制，例如：当items_dir_id =0
     * 4.index2/items/space_list()       主要是获取所有自己能管理的项目与目录，获取的是 get_dir_page()+ get_items_list()
     *
     * http://localhost/test_3/20181026/ky/todo/todo.kangyun3d.cn/public/index.php/index2/items/rename_dir
     *  */
    // 构造函数
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'items';//  实例话对象表名称
    }

    /**
     * 添加动作
     */
    public function add($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if ($this->validate($this->rule)->save($param)) {
            return ['code' => 200, 'id' => $this->id, 'info' => lang('message200')];
        }
        return ['code' => 401, 'id' => 0, 'info' => $this->getError()];

    }

    /**
     *  按条件修改指定的字段
     **/
    public function up($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where'])) {

            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        $field = [];
        $where = $param['where'];
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if ($this->validate($this->uprule)->save($field, $where)) {
            return ['code' => 200, 'info' => lang('message200')];
        }
        return ['code' => 401, 'info' => $this->getError()];
    }

    /**
     * 获取一条记录
     **/
    public function getArr($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }

        if (empty($param['where'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        $field = [];
        if (empty($param['where']['valid'])) {
            $param['where']['valid'] = 1;
        }
        $where = $param['where'];
        if (!empty($param['field'])) {
            $field = $param['field'];
        }
        if ($array = $this->where($where)->field($field)->find()) {
            return ['code' => 200, 'info' => $array];
        }

        return ['code' => 401, 'info' => $this->getError()];
    }

    /**
     * 获取一组记录
     */
    public function getList($param)
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
        if (empty($param['where']['valid'])) {
//            $param['where']['valid'] = 1;
            $where['valid'] = 1;
        }

        if (!empty($param['limit_num'])) {
            $page = $param['page'];
            $limit_num = $param['limit_num'];
            if ($array = $this->where($where)->field($field)->order($order)->paginate(['page' => $page, 'list_rows' => $limit_num])) {
                return ['code' => 200, 'info' => $array];
            }
        }
        if ($array = $this->where($where)->field($field)->order($order)->select()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];

    }

    public function del($param)
    {
        $array = [];
        if (!is_array($param)) {
            //throw new \Exception(lang('no_array'));
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
            //throw new \Exception(lang('is_empty'));
        }
        if ($this->where($param)->delete()) {
            return ['code' => 200, 'info' => lang('message200')];
        }
        return ['code' => 401, 'info' => $array];
    }

    /***
     * 捕获器
     */
    public function getCreateTimeAttr($value)
    {
        return $value * 1000;
    }

    /***
     * 捕获器
     */
    public function getUpdateTimeAttr($value)
    {
        return $value * 1000;
    }
    /****数据中间层****/
    /***
     * 移动项目
     **/
    public function rmItems($param)
    {
        $array = [];
        $_array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $userAarray = json_decode($param['where']['id'], true);
        if (!is_array($userAarray)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $this->startTrans();
        try {
            $InviteModel = new InviteCooperator();
            //获得path
            $array = [
                'code' => 401,
                'info' => lang('message401')
            ];
            $path = $this->getPtah($param['field']['items_dir_id']);
            if ($path['code'] == 200) {
                $param['field']['path'] = $path['info'];
            }
            //修改合作者最高级显示问题 11.19 kesheng
            $_temp_update_high = [];
            $_temp_update_high['id'] = $param['where']['id'];//项目id
            $_temp_update_high['dir_father_id'] = $param['field']['items_dir_id'];//移动到某个文件夹的id   
            $_temp_update_high['is_dir_items'] = 2;//1代表的是文件夹，
            $itemsDir = new ItemsDir();
            $itemsDir->updateHighFloor($_temp_update_high);//修改合作者最高级显示问题
            unset($_temp_update_high);
            foreach ($userAarray as $key => $value) {
                if (empty($param['field']['path'])) {
                    $_param['field']['path'] = $value;
                } else {
                    $_param['field']['path'] = $param['field']['path'] . '-' . $value;
                }
                if (!empty($param['where']['user_id'])) {
                    $_param['where']['user_id'] = $param['where']['user_id'];
                }
                $_param['where']['id'] = $value;
                $_param['field']['items_dir_id'] = $param['field']['items_dir_id'];
                $_array[] = $this->update($_param['field'], $_param['where']);
                if (!empty($_array)) {
                    //$this->setInvitcPath($value);
                    $_params = [];
                    $_params['father_id'] = $param['field']['items_dir_id'];
                    $_params['id'] = $value;
                    $_params['path'] = $_param['field']['path'];
                    $array[] = $this->setInvitcItems($_params);
                    //修改分享表数据
                    $p['items_id'] = $value;
                    $InviteModel->setInvitePath($p);
                }
            }
            if (isset($_array)) {
                $array = [
                    'code' => 200,
                    'info' => lang('message200')
                ];
            }
            $this->commit();
        } catch (Exception $exception) {
            $array = ['code' => 500, 'info' => $exception->getMessage()];
            $this->rollback();
        }
        return $array;
    }

    /**
     *把项目分享出去
     **/
    protected function setInvitcItems($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => lang('message401')];
        }
        if (empty($param['father_id'])) {
            return ['code' => 404, 'info' => lang('message404')];
        }
        $InviteModel = new InviteCooperator();
        $_param = [];
        $_param['where']['items_dir_id'] = $param['father_id'];
        $_param['field'] = ['user_id', 'invite_user_id', 'company_id', 'edit_type'];
        $array = $InviteModel->getList($_param);
        if ($array['code'] != 200) {
            return ['code' => 403, 'info' => lang('message401')];
        }
        foreach ($array['info'] as $k => &$v) {
            $_array[$k] = $v['invite_user_id'];
            $user_id = $v['user_id'];
            $company_id = $v['company_id'];
            $edit_type[$k] = $v['edit_type'];
        }
        if (empty($_array)) {
            return ['code' => 402, 'info' => lang('message401')];
        }
        $_param = [];
        foreach ($_array as $k => $v) {
            $_param[$k]['invite_user_id'] = $v;
            $_param[$k]['user_id'] = $user_id;
            $_param[$k]['company_id'] = $company_id;
            $_param[$k]['items_id'] = $param['id'];
            $status = $InviteModel->where($_param[$k])->field('id')->find();
            if (empty($status['id'])) {
                $_param[$k]['path'] = $param['path'];
                $_param[$k]['father_id'] = $param['father_id'];
                $_param[$k]['edit_type'] = $edit_type[$k];
                $_param[$k]['is_dir_items'] = 2;
                $_param[$k]['create_time'] = time();
                $_param[$k]['update_time'] = time();
            } else {
                unset($_param[$k]);
                unset($edit_type[$k]);
                continue;
            }
        }
        $array = $InviteModel->saveAll($_param);
        return $array;
    }

    /**
     * @itemsId 项目ID
     * @pId 父ID
     * @userId 用户id
     **/
    protected function setInvitcPath($iemsId)
    {
        $array = [];
        $param = [];
        if (empty($iemsId)) {
            return ['code' => 401, 'info' => lang('message401')];
        }
        try {
            $InviteModel = new InviteCooperator();
            $param['where']['id'] = $iemsId;
            $param['field'] = ['items_dir_id', 'path'];
            $array = $this->getArr($param);
            if ($array['code'] != 200) {
                return ['code' => 401, 'info' => lang('message401')];
            }
            $_param = [];
            $_param['where']['items_id'] = $iemsId;
            $_param['field'] = ['id'];
            $_array = $InviteModel->getArray($_param);
            if ($_array['code'] != 200) {
                return ['code' => 401, 'info' => lang('message401')];
            }
            $param = [];
            $param['where']['items_id'] = $iemsId;
            $param['field']['path'] = $array['info']['path'];
            $param['field']['father_id'] = $array['info']['items_dir_id'];
            $array = $InviteModel->up($param);
        } catch (Exception $exception) {
            $array = ['code' => 500, 'info' => [$exception->getMessage()]];
        }
        return $array;
    }

    //获取文件夹的PATH
    protected function getPtah($pId)
    {
        $array = [];
        if (empty($pId)) {
            return ['code' => 401, 'info' => lang('message401')];
        }
        $itemsDirModel = new ItemsDir();
        $array = $itemsDirModel->where(['id' => $pId, 'valid' => 1])->field(['path'])->find();
        if (empty($array)) {
            return ['code' => 401, 'info' => lang('message401')];
        }
        return ['code' => 200, 'info' => $array['path']];
    }


    /***
     * 对项目删除操作
     * @param array
     * return array
     */
    public function rmProject($param)
    {
        $array = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['where']['id'])) {
            return ['code' => 401, 'info' => $array[lang('is_empty')]];
        }
        if ($param['where']['items_dir_id'] == 0) {
            unset($param['where']['items_dir_id']);
        }
        $param['field']['valid'] = 0;
        $array = $this->up($param);
        return $array;

    }

    /***
     *修改项目详情保存接口
     **/
    public function upItems($param)
    {
        $array = [];
        $_param = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        if (empty($param['field']['title'])) {
            return ['code' => 411, 'info' => $array[lang('message411')]];
        }
        if (strlen($param['field']['title']) <= 2) {
            return ['code' => 407, 'info' => $array[lang('message407')]];
        }
        try {

            try{
                if(!empty(  $param['field']['location']  )){//修改经纬度
                   
                    // http://api.map.baidu.com/geocoder/v2/?address=广州加速器&output=json&ak=CZksSKfr5vVaA8vVQjft45VtxwmsTf3i
                    // ok {"status":0,"result":{"location":{"lng":113.50310900659518,"lat":23.162038031886469},"precise":1,"confidence":80,"comprehension":100,"level":"购物"}}
                    // error {"status":1,"msg":"Internal Service Error:无相关结果","results":[]}
                    $url = 'https://api.map.baidu.com/geocoder/v2/?address='. trim($param['field']['location'] )  .'&output=json&ak=CZksSKfr5vVaA8vVQjft45VtxwmsTf3i';
    
                    $get_baidu_lnglat_message = file_get_contents($url);
                    $get_baidu_lnglat_message = json_decode($get_baidu_lnglat_message , true);
                    if($get_baidu_lnglat_message['status'] === 0){
                        $param['field']['longitude'] =  $get_baidu_lnglat_message['result']['location']['lng']; // 经度
                        $param['field']['latitude'] =  $get_baidu_lnglat_message['result']['location']['lat']; // 纬度
                    }
                }
             	//return [ 'code' => 409, 'info' => json_encode($get_baidu_lnglat_message) ];
            }catch(\Exception $cc){
                 //return ['code' => 409, 'info' => $cc->getMessage() ];
            }
            

            $array = $this->up($param);
            if ($array['code'] != 200) {
                return $array;
            }
            
            $_param['where']['id'] = $param['where']['id'];
            $_param['field'] = ['title', 'detail_link', 'detail_username', 'detail_presenter', 'detail_phone', 'detail_email', 'description', 'location','items_orientation','house_type','items_area'];
            $array = $this->getArr($_param);
        } catch (Exception $exception) {
            return ['code' => 500, 'info' => $array[$exception->getMessage()]];
        }

        return $array;
    }

    

   

    /**
     *  发布百度地图
     **/
    public function send_bmap($id, $type, $user_id)
    {
        $array = [];
        $map = array();
        if ($type == 1) {
            $map['isshow_bmap'] = 1;
        } else if ($type == 2) {
            $map['isshow_offica'] = 1;
        }
        $where = [];
        $where['id'] = $id;
        if ($user_id) {
            $where['user_id'] = $user_id;
        }
        $res = $this->where($where)->update($map);
        $edit_url = $this->where($where)->column('edit_url');
        if ($edit_url) {
            $stratt = explode('=', $edit_url[0]);
            if (count($stratt) == 2) {
                $file = $stratt[1];
                $soure_file = "./assets/museum/01/$file/model.json";
                $to_file = "./assets/modal/scanItems/01/$file/model.json";
                copy($soure_file, $to_file);
            }
        }

        if ($res === false) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        } else {
            return ['code' => 200, 'info' => $array[lang('message200')]];
        }
    }


//获取项目详情
    public function spaceDetil($param)
    {

        $_param = [];
        $_param['where']['id'] = $param['id'];
        $_param['where']['company_id'] = $param['company_id'];
        $_param['field'] = ["user_id,items_dir_id,additional_info,address,addtime,category,create_time,creator,description,detail_email,detail_link,detail_phone,detail_presenter,detail_username,dirname,edit_url,featured,id,isshow_bmap,isshow_offica,latitude,location,longitude,marker_color,marker_image,rating,ribbon,sorts,title,update_time,url,valid,video,website,items_area,items_orientation,house_type"];

        $getItemsData = $this->getArr($_param);//查找项目
        if ($getItemsData['code'] !== 200) {
            return ['code' => 401, 'info' => lang('message401')];
        }
        $getItemsData = $getItemsData['info'];
        $getItemsData['edit_type'] = 2;
        //echo json_encode($param['user_id']);exit;
        if ($param['user_type'] == 3 && $getItemsData['user_id'] != $param['user_id']) { //合作者并且不是自己的项目
            $getItemsData['edit_type'] = 1; //先赋值为仅仅查看
            $inviteCooperator = new InviteCooperator();

            $items_param = [];
            $items_param['where']['invite_user_id'] = $param['user_id'];
            $items_param['where']['items_id'] = $param['id'];
            $items_param['field'] = ['edit_type'];

            $getCoopItems = $inviteCooperator->getArray($items_param); //查找邀请表的项目
            if ($getCoopItems['code'] == 200) { //有项目
                $getItemsData['edit_type'] = $getCoopItems['info']['edit_type']; //重新赋予编辑权限
            } else { //没有项目去找文件夹
                $items_param['where']['items_dir_id'] = $param['id'];
                unset($items_param['where']['items_id']); //销毁项目id
                $getCoopItemsDir = $inviteCooperator->getArray($items_param); //查找邀请表的文件夹
                if ($getCoopItemsDir['code'] == 200) { //有文件夹
                    $getItemsData['edit_type'] = $getCoopItemsDir['info']['edit_type']; //重新赋予编辑权限，该项目继承父级文件夹的分享权限
                } else {//执行到这里，证明文件夹和项目都没有

                    return ['code' => 401, 'info' => lang('message401')];
                }
            }

        }
        if($getItemsData){ //将面积有 12.00改成 12
            if( intval($getItemsData['items_area'] ) == $getItemsData['items_area'] ) { //取整 3.233=>3
                $getItemsData['items_area'] = intval($getItemsData['items_area'] );
            } 
        }
        return ['code' => 200, 'info' => $getItemsData];//返回获取到的项目详情

    }


    /**
     * 一键隐藏公共空间
     */
    public function isofficabmap($param)
    {
        $sql = [
            'where' => ['id' => $param],
            'field' => ['isshow_offica' => 0, 'isshow_bmap' => 0]
        ];
        $res = $this->up($sql);
        return $res;
    }

    /**
     * 查询指定公司下的公开空间列表
     * @param $param [公司id，页数，每页数量]
     */
    public function publicspacelist($param)
    {
        $forSortSql = [1 => 'title', 2 => 'create_time'];
        $getEditType = 0;
        $sortSql = $forSortSql[$param['sort_type']] . ' desc';
        //用户类型为合作者
        if ($param['user_type'] == 3) {
            $whereCooper = [
                'where' => ['invite_user_id' => $param['user_id'] , 'company_id'=> $param['company_id'] ],
                'field' => ['items_dir_id', 'items_id', 'edit_type',]
            ];
            $cooper = new InviteCooperator;
            $cooperItem = $cooper->getList($whereCooper);
            if ($cooperItem['code'] == 200) {
                //如果该合作者有被邀请
                $cooperRaw = [];
                foreach ($cooperItem['info'] as $k => $v) {
                    $cooperRaw[] = $v->data;
                }
                //放置权限备用
                $getEditType = $cooperRaw;
                //去除0值
                foreach ($cooperRaw as $ks => $vs) {
                    foreach ($vs as $k => $v) {
                        if ($v === 0) {
                            unset($cooperRaw[$ks][$k]);
                        }
                    }
                }
                //生成查询条件
                $cooperList = ['items_id' => [], 'items_dir_id' => []];
                foreach ($cooperRaw as $ks => $vs) {
                    foreach ($vs as $k => $v) {
                        if ($k !== 'edit_type') {
                            $cooperList[$k][] = $v;
                        }
                    }
                }
            //            if (count($cooperList['items_id']) == 0 && count($cooperList['items_dir_id']) == 0) {
            //                return 401;
            //            }
            //            halt($cooperList);
                //查询公开空间项目
                $cooperRes = $this
                    ->where(function ($query) use ($cooperList, $param) {
                        $query->where('items_dir_id', 'in', $cooperList['items_dir_id'])
                            ->whereOr('id', 'in', $cooperList['items_id'])
                            ->whereOr('user_id', $param['user_id']);
                    })
                    ->where('isshow_offica', 1)
                    ->where('valid', 1)
                    ->where('marker_image', 'neq', "")
                    ->where('company_id',$param['company_id'])
                    ->order($sortSql)
                    ->field('id,company_id,items_dir_id,dirname,user_id,longitude,latitude,address,featured,title,location,detail_username,detail_presenter,detail_phone,detail_email,detail_link,website,category,rating	,url,marker_image,additional_info,description,ribbon,video,marker_color,create_time,isshow_offica,isshow_bmap,sorts,update_time,edit_url,creator,valid,is_table')
                    ->paginate(['page' => $param['page'], 'list_rows' => $param['limit_num']]);
            //                ->limit(0, $param['limit_num'])
            //                ->select();

            //            halt($cooperRes->total());
            } else {
                //该合作者没有任何被邀请记录
                $cooperRes = $this
                    ->where('user_id', $param['user_id'])
                    ->where('company_id',$param['company_id'])
                    ->where('isshow_offica', 1)
                    ->where('valid', 1)
                    ->where('marker_image', 'neq', "")
                    ->order($sortSql)
                    ->field('id,company_id,items_dir_id,dirname,user_id,longitude,latitude,address,featured,title,location,detail_username,detail_presenter,detail_phone,detail_email,detail_link,website,category,rating	,url,marker_image,additional_info,description,ribbon,video,marker_color,create_time,isshow_offica,isshow_bmap,sorts,update_time,edit_url,creator,valid,is_table')
                    ->paginate(['page' => $param['page'], 'list_rows' => $param['limit_num']]);


            }
            $res = [];
            if (count($cooperRes) == 0) {
                return 401;
            }
            $countNum = $cooperRes->total();
            if ($countNum == null) {
                return 401;
            }
            foreach ($cooperRes as $k => $v) {
                $res[$k] = $v->data;
            }

            //放置项目对应的权限
            foreach ($res as $rk => &$rv) {
                $rv['edit_type'] = 1;
            //                $rv['create_time'] = $rv['create_time'] * 1000;
                if ($getEditType !== 0) {//如果没有被邀请的项目
                    foreach ($getEditType as $ck => $cv) {
                        if ($rv['id'] === $cv['items_id'] || $rv['items_dir_id'] === $cv['items_dir_id']) {
                            $rv['edit_type'] = $cv['edit_type'];
                        }
                    }
                } else {
                    $rv['edit_type'] = 2;
                }
            }

        } else {//用户类型为管理员
            $unsortList = [
                'where' => ['company_id' => $param['company_id'], 'isshow_offica' => 1, 'marker_image' => ['neq', ""]],
                'page' => $param['page'],
                'limit_num' => $param['limit_num'],
                'order' => $sortSql,
                'field' => ['id', 'company_id', 'items_dir_id', 'dirname', 'user_id', 'longitude', 'latitude', 'address', 'featured', 'title', 'location', 'detail_username', 'detail_presenter', 'detail_phone', 'detail_email', 'detail_link', 'website', 'category', 'rating', 'url', 'marker_image', 'additional_info', 'description', 'ribbon', 'video', 'marker_color', 'create_time', 'isshow_offica', 'isshow_bmap', 'sorts', 'update_time', 'edit_url', 'creator', 'valid', 'is_table']
            ];
            $raw = $this->getList($unsortList);
//            if ($raw['code'] === 401) {
            if (count($raw['info']) == 0) {
                return 401;
            }
            $info = $raw['info'];
            $countNum = $info->total();
            $res = [];
            foreach ($info as $k => $v) {
                $res[$k] = $v->data;
            }
            //放置管理员权限
            foreach ($res as $k => &$v) {
                $v['edit_type'] = 2;
            }
        }
        //加入名字,改写create_time
        $forName = [];
        foreach ($res as $k => &$v) {
            $forName[$k]['items_id'] = $v['id'];
            $forName[$k]['user_id'] = $v['user_id'];
            $v['create_time'] = (int)($v['create_time'] . '000');
        }
        $userNames = getNames($forName);
        foreach ($userNames as $uk => $uv) {
            foreach ($res as $k => &$v) {
                if ($v['user_id'] == $uv['user_id']) {
                    $v['first_name'] = $uv['first_name'];
                    $v['last_name'] = $uv['last_name'];
                }
            }
        }
        $resc['count'] = $countNum;
        $resc['res'] = $res;
        return $resc;
    }

    /**
     * 公共空间列表排序
     * @param $param 原始列表
     * @param $sort_type 排序类型
     */
    public function sortlist($param, $sort_type)
    {

        switch ($sort_type) {
            //名称排序
            case $sort_type == 1:
                try {
                    $res = utf8sort($param, 'title', 1);
                } catch (\Exception $e) {
                    return ['code' => 401, 'info' => $e->getMessage()];
                }
                break;
            //时间倒叙
            case $sort_type == 2:
                try {
                    $res = utf8sort($param, 'create_time', 2);
                } catch (\Exception $e) {
                    return ['code' => 401, 'info' => [lang('something wrong in common.utf8sort')]];
                }
                break;
        }
        return $result = ['data' => ['list' => $res, 'total' => count($res)]];
    }

    /***
     * 搜索
     * @param array
     **/
    public function searchData($param)
    {
        $array = [];
        $_array = [];
        $data['data'] = [];
        $_data['data'] = [];
        if (!is_array($param)) {
            return ['code' => 401, 'info' => $array[lang('no_array')]];
        }
        $page = $param['page'];
        $startrow = ($page - 1) * 10;

        $itemsDirMode = new ItemsDir();
        try {
            // 查询名称
            if ($param['type'] == 1) {
                $sql = "SELECT COUNT(id) AS tp_count FROM (( SELECT id,is_table FROM items_dir WHERE dir_name LIKE '%" . $param['key'] . "%'  AND valid =1 AND company_id=" . $param['company_id'] . " ) UNION ALL 
                                      (SELECT id,is_table FROM  items WHERE title LIKE  '%" . $param['key'] . "%'  AND valid  =1  AND  company_id=" . $param['company_id'] . " )) AS a ";
                $_count = Db::query($sql);
                $count = isset($_count[0]['tp_count']) ? $_count[0]['tp_count'] : 0;
                $sql = "SELECT * FROM (( SELECT id,is_table FROM items_dir WHERE dir_name LIKE '%" . $param['key'] . "%'  AND valid =1 AND company_id=" . $param['company_id'] . ") UNION ALL 
                                      (SELECT id,is_table FROM  items WHERE title LIKE  '%" . $param['key'] . "%'  AND valid  =1 AND company_id=" . $param['company_id'] . " )) AS a  LIMIT {$startrow},10";
                $resurl = Db::query($sql);
                foreach ($resurl as $k => $value) {
                    if ($value['is_table'] == 1) {
                        $array[] = $value['id'];//表1的
                    } else {
                        $_array[] = $value['id'];//表3的dir
                    }
                }

                if (!empty($array)) {

                    if ($param['user_type'] == 3) {// 普通用户
                        $array = $this->getUserItme($array, $param['user_id'], 1);//返回用户的文件夹ID
                    }
                    $data['data'] = $itemsDirMode->where('id', 'in', $array)->select();
                }
                if (!empty($_array)) {
                    if ($param['user_type'] == 3) {// 普通用户
                        $_array = $this->getUserItme($_array, $param['user_id'], 3);//返回用户的文件夹ID
                    }
                    $_data['data'] = $this->where('id', 'in', $_array)->select();
                }

            }
            //查询地址
            if ($param['type'] == 2) {

                $_count = $this->where('location', 'like', '%' . $param['key'] . '%')->where(['valid' => 1, 'company_id' => $param['company_id']])->field('id')->count('id');
                $count = $_count;
                $resurl = $this->where('location', 'like', '%' . $param['key'] . '%')->where(['valid' => 1, 'company_id' => $param['company_id']])->field('id')->page($page, 10)->select();
                foreach ($resurl as $k => $v) {
                    $_array[] = $v['id'];
                }
                if ($param['user_type'] == 3) {// 普通用户
                    $_array = $this->getUserItme($_array, $param['user_id'], 3);//返回用户的文件夹ID
                }
                $_data['data'] = $this->where('id', 'in', $_array)->select();
            }
            if (!empty($_data['data'])) {
                foreach ($_data['data'] as $k => &$v) {
                    $userData = $this->getUserFirstname($v['user_id']);
                    if ($userData['code'] == 200) {
                        $v['lastname'] = $userData['info']['lastname'];
                        $v['firstname'] = $userData['info']['firstname'];
                    }
                }
            }
            $res = [
                'code' => 200,
                //'message' => lang('message200'),
                'dir' => $data,
                'items' => $_data,
                'count' => $count
            ];

        } catch (Exception $exception) {
            $res = ['code' => 500, 'message' => $exception->getMessage()];
        }

        return $res;
    }

    protected function getUserFirstname($userId)
    {
        $array = [];
        if (empty($userId)) {
            return ['code' => 401, 'message' => [lang('message401')]];
        }
        $userModel = new User();
        $param = [];
        $param['where']['id'] = $userId;
        $param['field'] = ['lastname', 'firstname'];
        $array = $userModel->getArr($param);
        return $array;
    }

    /**
     * 查询用户是否拥有
     * @param array
     * @userId int
     **/
    protected function getUserItme($param, $userId, $is_table = 1)
    {
        $array = [];
        $_array = [];
        $data = [];
        if (!is_array($param) || $userId == 0) {
            return [];
        }
        try {
            if ($is_table == 1) {
                $modeL = new ItemsDir();
            } else {
                $modeL = $this;
            }
            $array = $modeL->where('id', 'in', $param)->where(['user_id' => $userId])->field('id')->select();
            if (!empty($array)) {
                foreach ($array as $k => $v) {
                    $_array[] = $v['id'];//用户所拥有的
                }
            }
            $data = array_diff($param, $_array);//删除用户拥有的
            $array = $this->geitInvite($data, $userId, $is_table);//用户分享的
            $array = array_merge($_array, $array);
        } catch (Exception $exception) {
            $array = ['code' => 500, 'message' => $exception->getMessage()];
        }
        return $array;
    }

    /***
     *   查找是否被分享
     * @param array
     * @userId int
     **/
    protected function geitInvite($param, $userId, $is_tabel = 1)
    {
        $array = [];
        $_array = [];
        $where = [];
        if (!is_array($param) || $userId == 0) {
            return [];
        }
        try {
            $where['invite_user_id'] = $userId;
            $field = ($is_tabel == 1) ? 'items_dir_id' : 'items_id';
            $InviteModel = new InviteCooperator();
            $array = $InviteModel->where($field, 'in', $param)->where($where)->field($field)->select();
            if (!empty($array)) {
                foreach ($array as $k => $v) {
                    if (in_array($v[$field], $param)) {
                        $_array[] = $v[$field];
                    }
                }
            }
            $array = $_array;
        } catch (Exception $exception) {
            $array = ['code' => 500, 'message' => $exception->getMessage()];
        }
        return $array;
    }

    /**
     * 统计获取账号名下所有项目数量
     * @param $param
     * @param $user_id
     * @return int|string
     */
    public function statisticsCountAllItemsNum($param, $user_id)
    {
        $where = ['items_id' => [], 'items_dir_id' => []];
        $where['items_id'] = $param['items_id'];
        $where['items_dir_id'] = $param['items_dir_id'];

        if (!empty($where['items_id']) && !empty($where['items_dir_id'])) {
            $getCount = $this
                ->where(function ($query) use ($where, $user_id) {
                    $query->where('id', 'in', $where['items_id'])
                        ->whereOr('items_dir_id', 'in', $where['items_dir_id'])
                        ->whereOr('user_id', $user_id);
                })
                ->where('valid', 1)
                ->count('id');
        }
        if (empty($where['items_id']) && !empty($where['items_dir_id'])) {
            $getCount = $this
                ->where(function ($query) use ($where, $user_id) {
                    $query->where('items_dir_id', 'in', $where['items_dir_id'])
                        ->whereOr('user_id', $user_id);
                })
                ->where('valid', 1)
                ->count('id');
        }
        if (!empty($where['items_id']) && empty($where['items_dir_id'])) {
            $getCount = $this
                ->where(function ($query) use ($where, $user_id) {
                    $query->where('id', 'in', $where['items_id'])
                        ->whereOr('user_id', $user_id);
                })
                ->where('valid', 1)
                ->count('id');
        }
        if (empty($where['items_id']) && empty($where['items_dir_id'])) {
            $getCount = 0;
        }

        return $getCount;
    }


    /**
     * 统计合作者权限获取项目
     * @param $invs
     * @param $user_id
     * @param $isExcel
     * @param $page
     * @param $limitNum
     * @return array|false|\PDOStatement|string|\think\Collection
     * @throws \think\db\exception\DataNotFoundException
     * @throws \think\db\exception\ModelNotFoundException
     * @throws \think\exception\DbException
     */
    public function statisticsGetItems($invs, $user_id, $isExcel, $page, $limitNum, $orderBy)
    {
        $orderBy = $orderBy . ' desc';
        $itemsRaw = 0;
        switch ($invs) {
            //该用户名下既有文件夹邀请，又有具体项目邀请
            case (!empty($invs['items_id']) && !empty($invs['items_dir_id'])):
                if ($isExcel === 1) {//如果需要导出，则拉去全部项目
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('id', 'in', $invs['items_id'])
                                ->whereOr('items_dir_id', 'in', $invs['items_dir_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->select();

                } else {
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('id', 'in', $invs['items_id'])
                                ->whereOr('items_dir_id', 'in', $invs['items_dir_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->paginate(['page' => $page, 'list_rows' => $limitNum]);
        //                        ->limit($page, $limitNum)
        //                        ->select();
                }
                break;
            //用户只有文件夹邀请
            case (empty($invs['items_id']) && !empty($invs['items_dir_id'])):
                if ($isExcel === 1) {//如果需要导出，则拉去全部项目
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('items_dir_id', 'in', $invs['items_dir_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->select();
                } else {
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('items_dir_id', 'in', $invs['items_dir_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->paginate(['page' => $page, 'list_rows' => $limitNum]);
        //                        ->limit($page, $limitNum)
        //                        ->select();
                }
                break;
            //用户只有被邀请具体项目
            case(!empty($invs['items_id']) && empty($invs['items_dir_id'])):
                if ($isExcel === 1) {//如果需要导出，则拉去全部项目
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('id', 'in', $invs['items_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->select();
                } else {
                    $itemsRaw = $this
                        ->where(function ($query) use ($invs, $user_id) {
                            $query->where('id', 'in', $invs['items_id'])
                                ->whereOr('user_id', $user_id);
                        })
                        ->where('valid', 1)
                        ->order($orderBy)
                        ->paginate(['page' => $page, 'list_rows' => $limitNum]);
        //                        ->limit($page, $limitNum)
        //                        ->select();
                }
                break;
            default:
                $itemsRaw = 0;
        }
        return $itemsRaw;
    }

}

