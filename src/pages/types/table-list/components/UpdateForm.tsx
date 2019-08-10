import { Form, Input, Modal, InputNumber } from 'antd';
import React, { Component } from 'react';

import { FormComponentProps } from 'antd/es/form';
import { TableListItem, shopCombleInfo } from '../data.d';

export interface FormValsType extends Partial<TableListItem> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
  printRelId?: number;
}

export interface UpdateFormProps extends FormComponentProps {
  handleUpdateModalVisible: (flag?: boolean, formVals?: FormValsType) => void;
  handleUpdate: (values: FormValsType) => void;
  updateModalVisible: boolean;
  values: Partial<TableListItem>;
  shopComble: shopCombleInfo;
}
const FormItem = Form.Item;

export interface UpdateFormState {
  formVals: FormValsType;
  currentStep: number;
}

class UpdateForm extends Component<UpdateFormProps, UpdateFormState> {
  static defaultProps = {
    handleUpdate: () => {},
    handleUpdateModalVisible: () => {},
    values: {},
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  handleSubmit = () => {
    const { form, handleUpdate } = this.props;
    form.validateFields((err, value) => {
      if (err) return;
      handleUpdate(value);
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, form } = this.props;
    console.log('updata props', this.props);
    const updateForm = (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...this.formLayout}>
          {form.getFieldDecorator('printRelId', {
            rules: [{ required: true, message: '请选择商品类型' }],
            initialValue: values.printType,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formLayout}>
          {form.getFieldDecorator('price', {
            rules: [{ required: true, message: '请输入商品价格' }],
            initialValue: values.printPrice,
          })(<InputNumber min={0} />)}
        </FormItem>
      </Form>
    );

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false, values)}
        afterClose={() => handleUpdateModalVisible()}
      >
        {updateForm}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
