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
  price?: number;
  printType: string;
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
    const { form, handleUpdate, values } = this.props;
    form.validateFields((err, formValue) => {
      if (err) return;
      formValue.printRelId = values.printRelId;
      handleUpdate(formValue);
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values, form } = this.props;
    const updateForm = (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...this.formLayout} label="商品类型">
          {form.getFieldDecorator('printType', {
            rules: [{ required: true, message: '请选择商品类型' }],
            initialValue: values.printType,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...this.formLayout} label="商品价格">
          {form.getFieldDecorator('price', {
            rules: [{ required: true, message: '请输入商品价格' }],
            initialValue: values.printPrice,
          })(<InputNumber style={{ width: '100%' }} min={0} />)}
        </FormItem>
      </Form>
    );

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="编辑商品"
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible(false)}
        onOk={() => this.handleSubmit()}
      >
        {updateForm}
      </Modal>
    );
  }
}

export default Form.create<UpdateFormProps>()(UpdateForm);
