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

class StatisticsViewCount extends Model
{
    //新增前验证
    protected $rule = [
        ['count', 'require|number|>:0', '计数必须|数字型|大于0'],
        ['type', 'require|number|>:0', '类型必须|数字型|大于0'],
        ['items_id', 'require|number|>:0', '项目ID必须|数字型|大于0'],
        ['create_time', 'require|number|>:0', '项目ID必须|数字型|大于0']
    ];
    //修改前验证
    protected $uprule = [

    ];
    protected $updateTime = false;
    protected $autoWriteTimestamp = true;
    protected function initialize()
    {
        parent::initialize();
        $this->table = 'statistics_view';//  实例话对象表名称
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
}