<?php
/**
 * Created by PhpStorm.
 * User: NickDeng
 * Date: 2018/11/16
 * Time: 11:22
 */

namespace app\index2\model;


use think\Db;
use think\Model;
use think\Exception;

class StatisticsView extends Model
{
    //新增前验证
    protected $rule = [
        ['user_id', 'number|>:0', '数字型|大于0'],
        ['type', 'require|number|>:0', '类型必须|数字型|大于0'],
        ['items_id', 'require|number|>:0', '项目ID必须|数字型|大于0']
    ];
    //修改前验证
    protected $uprule = [
    ];
    protected $updateTime = false;
    protected $autoWriteTimestamp = true;
    protected $table = 'statistics_view';//  实例话对象表名称

    protected function initialize()
    {
        parent::initialize();

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
     * 读取统计信息
     * @param $itemsIdList
     * @param $time
     * @return mixed
     */
    public function count_all($itemsIdList, $time)
    {
        $timeHorizon = midnightBefore($time);
        $ids = implode(',', $itemsIdList);

        if ($time == 100) {
            $countRaws = Db::query("SELECT `items_id`,`type`, COUNT(`type`) as `count` FROM `statistics_view` where `items_id` in ({$ids})  GROUP BY `items_id`,`type`");
        } else {
            $countRaws = Db::query("SELECT `items_id`,`type`, count(`type`) as `count` FROM `statistics_view` where `items_id` in ({$ids})  and `create_time` > {$timeHorizon} GROUP BY `items_id`,`type`");
        }
        $countRaw = [];
        foreach ($countRaws as $k => $v) {
            $countRaw[$v['items_id']][$v['type']] = $v['count'];
        }
        foreach ($countRaw as $k => &$v) {
            for ($i = 1; $i < 4; $i++) {
                if (!array_key_exists($i, $v)) {
                    $v[$i] = 0;
                }
            }
        }
//        halt($countRaw);
        return $countRaw;
    }


    public function countOne($itemsId)
    {

        $count = Db::query("SELECT `type`, COUNT(`type`) as `count` FROM `statistics_view` where `items_id` = {$itemsId}  GROUP BY `type`");
        $res = ['type_1' => 0, 'type_2' => 0, 'type_3' => 0];
        if (count($count) != 0) {
            foreach ($count as $k => $v) {
                $res['type_' . $v['type']] = $v['count'];
            }
        }
        return $res;
    }

    /**
     * 同时保存特殊访客和普通访问用，可以扩展同时保存N个数据
     * （使用事务，若没有全部成功，会回滚）
     * @param array  多个需要保存的数组
     * @return int
     */
    public function saveTwoType($data)
    {
        if (!is_array($data)) {
            return 401;
        }

        Db::startTrans();
        $insertNum = Db::table('statistics_view')->insertAll($data);
        if ($insertNum == 2) {
            Db::commit();
            return 200;
        } else {
            Db::rollback();
            return 401;
        }
    }


    public function twoTypeCount($where)
    {
        $list = [];
        $timeHorizon = midnightBefore($where['time']);
        //查items_id
        if ($where['in'] === 1) {
            //单个条件查询，例如没有被邀请记录的合作者，或者管理员,查询名下项目items_id
            if($where['time'] == 100){
                $list = Db::table('items')
                    ->where($where['where'], $where['eq'])
                    ->where('valid', 1)
                    ->field('id')
                    ->select();
                if (empty($list)) {
                    return 401;
                }
            }else{
                $list = Db::table('items')
                    ->where($where['where'], $where['eq'])
                    ->where('valid', 1)
                    ->where('create_time','>',$timeHorizon)
                    ->field('id')
                    ->select();
                if (empty($list)) {
                    return 401;
                }
            };

        } else {
            //名下有邀请记录的合作者，需要多个条件查询,查询名下项目items_id
            if($where['time'] == 100) {
                $list = Db::table('items')
                    ->where(function ($query) use ($where) {
                        $query->where('id', 'in', $where['items_id'])
                            ->whereOr('items_dir_id', 'in', $where['items_dir_id'])
                            ->whereOr('user_id', $where['user_id']);
                    })
                    ->where('valid', 1)
                    ->field('id')
                    ->select();
                if (empty($list)) {
                    return 401;
                }
            }else{
                $list = Db::table('items')
                    ->where(function ($query) use ($where) {
                        $query->where('id', 'in', $where['items_id'])
                            ->whereOr('items_dir_id', 'in', $where['items_dir_id'])
                            ->whereOr('user_id', $where['user_id']);
                    })
                    ->where('valid', 1)
                    ->where('create_time','>',$timeHorizon)
                    ->field('id')
                    ->select();
                if (empty($list)) {
                    return 401;
                }
            }
        }
        //根据名下items_id获取

        $array = [];
        foreach ($list as $k => $v) {
            $array[] = $v['id'];
        }
        $ids = implode(',', $array);
        $twoTypeCounts = Db::query("SELECT `type`, COUNT(`type`) as `count` FROM `statistics_view` where `items_id` in ({$ids}) AND `type` in (1,2) GROUP BY `type`");
        if ($twoTypeCounts == false) {
            return 401;
        } else {
            //如果有一类型是空置，赋给0
            $res = [
                'typeOneCount' => 0,
                'typeTwoCount' => 0
            ];
            foreach ($twoTypeCounts as $k => $v) {
                if ($v['type'] == 1) {
                    $res['typeOneCount'] = $v['count'];
                }
                if ($v['type'] == 2) {
                    $res['typeTwoCount'] = $v['count'];
                }
            }
            return $res;
        }

    }
}