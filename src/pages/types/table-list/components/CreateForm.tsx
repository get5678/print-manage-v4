import { Form, Modal, Select, InputNumber } from 'antd';
import { shopCombleInfo } from '../data.d';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fields: { price: number; conbineId: string }) => void;
  handleModalVisible: () => void;
  shopComble: shopCombleInfo[];
}

const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, shopComble } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  return (
    <Modal
      destroyOnClose
      title="新建商品"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品编号">
        {form.getFieldDecorator('conbineId', {
          rules: [{ required: true, message: '请选择商品编号' }],
          initialValue: shopComble[0] ? shopComble[0].id : undefined,
        })(
          <Select style={{ width: '100%' }}>
            {shopComble.map((item: shopCombleInfo) => (
              <Option value={item.id} key={item.id}>
                {item.typeName}
              </Option>
            ))}
          </Select>,
        )}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品价格">
        {form.getFieldDecorator('price', {
          rules: [{ required: true }],
          initialValue: 0.8,
        })(<InputNumber style={{ width: '100%' }} min={0} />)}
      </FormItem>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
