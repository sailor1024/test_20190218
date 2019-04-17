<?php
/**
 * Created by PhpStorm.
 * User: NickDeng
 * Date: 2018/11/16
 * Time: 11:22
 */

namespace app\index2\model;


use think\Model;
use think\Exception;
use think\db;

class StatisticsUserIpDevice extends Model
{
    //新增前验证
    protected $rule = [
        ['ip', 'require', 'ip必须'],
        ['device', 'require|number|>:0', '设备类型必须|数字型|大于0'],
        ['items_id', 'require|number|>:0', '项目ID必须|数字型|大于0'],
//        ['create_time', 'require|number|>:0', '项目ID必须|数字型|大于0']
    ];
    //修改前验证
    protected $uprule = [

    ];
    protected $updateTime = false;
    protected $autoWriteTimestamp = true;
    protected $table = 'statistics_ip_device';
    protected function initialize()
    {
        parent::initialize();
//        $this->table = 'statistics_ip_device';//  实例话对象表名称
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
//        if (empty($param['where']['valid'])) {
//            $param['where']['valid'] = 1;
//        }
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
            $param['where']['valid'] = 1;
        }
        if ($param['page'] >= 0 && !empty($param['limit_num'])) {

            $page = $param['page'];
            $limit_num = $param['limit_num'];
            if ($array = $this->where($where)->field($field)->order($order)->limit($page, $limit_num)->select()) {
                return ['code' => 200, 'info' => $array];
            }
        }
        if ($array = $this->where($where)->field($field)->order($order)->select()) {
            return ['code' => 200, 'info' => $array];
        }
        return ['code' => 401, 'info' => $this->getError()];

    }


    /**
     * 检查用户是否为新的特别访客
     * @param $params 访问用户ip和设备
     */
    public function checkUser($params)
    {
        $check = [
            'ip' => $params['ip'],
            'device' => $params['device'],
            'items_id' => $params['items_id'],
            'create_time' =>time()
        ];
        //把ip字符串转换成int
        $ipSelect = " SELECT * FROM `statistics_ip_device` WHERE `ip` = INET_ATON('{$check['ip']}') AND `device`={$check['device']} AND `items_id`={$check['items_id']}";
        $countCheck = Db::query($ipSelect);
//        $countCheck = $this->where($check)->find();
//        $res = $resInfo['info'];
        if (count($countCheck) == 0) {
            $ipInsert = " INSERT  INTO `statistics_ip_device` (`ip`,`items_id`,`device`,`create_time`)VALUES (INET_ATON('{$check['ip']}'),{$check['items_id']},{$check['device']},{$check['create_time']})";
            $res = Db::execute($ipInsert);
//            $res = $this->add($check);
            if ($res == 0) {
                return 401;
            } else {
                return 202;
            }
        }
        return 200;
    }
}