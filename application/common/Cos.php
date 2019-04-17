<?php
/**
 * Created by PhpStorm.
 * User: admin
 * Date: 2018/12/3
 * Time: 18:41
 */

namespace app\common;

use Qcloud\Cos\Client;
use Qcloud\Cos\Exception\ServiceResponseException;
use think\Loader;

class Cos
{
    private $confign;
    private $bucket;
    private $cosClient;
    private $result;
    private $appId;
    /**设置配置文件实列话对象
     * @param  $buket 桶名称；空间名格式为：{name}-{appid} ，此处填写的存储桶名称必须为此格式
     **/
    public function __construct($bucket)
    {
        Loader::import('cos.cos-autoloader', EXTEND_PATH, '.php');
        $this->bucket = $bucket;
        $this->confign['region'] = 'ap-guangzhou';
        $this->appId='1257907741';
        $this->confign['credentials']['secretId'] = 'AKIDvumWIAu7iEk7saaagmjZdnHrKpp0DriX';
        $this->confign['credentials']['secretKey'] = '0xdGTc630pU2Q752udrDIIiCa6sLnFp5';
        $this->cosClient = new Client($this->confign);
    }

    /***大文件上传
     * param $key对象键（Key） 对象在存储桶中的唯一标识例如，在对象的访问域名 bucket1-1250000000.cos.ap-guangzhou.myqcloud.com/doc1/pic1.jpg 中，对象键为 doc1/pic1.jpg
     * param $body上传文件的内容，可以为文件流或字节流
     * return array
     */
    public function upFile($key, $body)
    {
        try {
            set_time_limit(0);
            $_body = file_get_contents($body);
            $this->result = $this->cosClient->Upload($this->bucket, $key, $_body);
            $array = ['code' => 200, 'info' => [$this->result['Location']]];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return $array;
    }

    /***
     *创建空间目录
     * return array
     */
    public function createBuket()
    {
        try {
            $this->cosClient->createBucket(['Bucket' => $this->bucket]);
            $array = ['code' => 200, 'info' => [lang('message200')]];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return $array;
    }

    /***
     *  删除空间目录
     * return array
     **/
    public function deleteBuket()
    {
        try {
            $this->cosClient->deleteBucket(['Bucket' => $this->bucket]);
            $array = ['code' => 200, 'info' => [lang('message200')]];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return $array;
    }

    /***
     *  物理删除空间文件
     * param $key 对象键（Key）
     * return array
     **/
    public function deleteFiel($key)
    {
        try {
            $this->cos_client->deleteObject(
                ['Bucket' => $this->bucket, 'Key' => $key]
            );
            $array = ['code' => 200, 'info' => [lang('message200')]];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return $array;
    }

    /***
     * 获取空间桶列表
     */
    public function getBucketList()
    {
        try {
            $this->result = $this->cosClient->listBuckets();
            $array = ['code' => 200, 'info' => $this->result['Buckets']];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return $array;
    }

    /***
     * 下载文件
     *param $key 对象键（Key）
     * param $saveAs本地保存路径
     */
    public function GetObject($key, $saveAs = '')
    {
        try {
            //$this->result=$this->cosClient->getObject();
            //$this->result = $this->cosClient->Copy($this->bucket, $key, $saveAs);
            $array = ['code' => 200, 'info' => $this->result];
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
        return [];
    }

    /***
     *  设置桶的权限
     **/
    public function setBucketAclInvalid($key=0)
    {   $array=['public-read','private','public'];
        try {
            $this->cosClient->PutBucketAcl(
                array(
                    'Bucket' => $this->bucket,
                    'ACL'=>$array[$key]
                ));
        } catch (ServiceResponseException $e) {
            return ['code' => $e->getStatusCode(), 'info' => [$e->getResponse()]];
        }
    }
}

?>