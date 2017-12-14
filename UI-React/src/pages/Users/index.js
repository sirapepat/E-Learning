import React from 'react';
import { signup , getUserDepartment , deleteUser , updateUser , getDepartment } from '../../api'
import { Segment , List , Tab , Label , Form , Button , Icon , Modal , Dropdown } from 'semantic-ui-react'

class Users extends React.Component {
    state = {
        allDepartments: [],
        allUsers: [],
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        department: "",
        email: "",
        tel: "",
        firstNameModal: "",
        lastNameModal: "",
        usernameModal: "",
        passwordModal: "",
        departmentModal: "",
        emailModal: "",
        telModal: "",
        id: "",
        options: [{text:"",value:""}],
        defaultDepartment: 0
    }

    handleChange = (e, { name, value }) => this.setState({ [name]: value })

    handleChangeModal = (e, { name, value }) => this.setState({ [name]: value })

    handleSubmit = event => {
        event.preventDefault() //no refresh
        const { firstName, lastName, username, password, department, email, tel } = this.state
        const data = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            department: department,
            email: email,
            tel: tel
        }
        console.log(data)
        signup(data)
            .then(data => {
                if (data.status === 200) {
                    window.location.reload()
                }
            })
    }

    setUser = (data,options) => {
        const defaultDepartment = 0
        for(var i = 0; i < options.length; i++){
            if(options.map(item => item.value)[i] === data.department){
                this.defaultDepartment = i
            }
        }
        this.setState({
            id: data._id,
            firstNameModal: data.firstName,
            lastNameModal: data.lastName,
            usernameModal: data.username,
            passwordModal: data.password,
            departmentModal: data.department,
            emailModal: data.email,
            telModal: data.tel,
            options: options,
            defaultDepartment: this.defaultDepartment
        })
    }

    deleteUser = (data) => {
        console.log(data._id)
        deleteUser(data)
        .then(this.props.history.replace('/'))
        .catch(err => console.error('Something went wrong.'))
    }

    editUser = () => {
        console.log(this.state)
        const data = {
            firstName: this.state.firstNameModal,
            lastName: this.state.lastNameModal,
            username: this.state.usernameModal,
            email: this.state.emailModal,
            tel: this.state.telModal,
            password: this.state.passwordModal,
            department: this.state.departmentModal
            
        }
        console.log(data)
        updateUser(data,this.state.id)
        .then(this.props.history.replace('/'))
        .catch(err => console.error('Something went wrong.'))
    }

    componentWillMount() { 
        getUserDepartment()
        .then(user => this.setState({allUsers: user}))
        .catch(err => console.error('Something went wrong.'))
        getDepartment()
        .then(department => this.setState({allDepartments: department}))
        .catch(err => console.error('Something went wrong.'))
    }

    render() {
        const { firstName, lastName, username, password, department, email, tel } = this.state
        const users = this.state.allUsers.filter(item => item.department !== 'admin')
        const departments = this.state.allDepartments
        const names = []
        const options = []
        departments.forEach( v => names.indexOf(v.name) === -1 ? names.push(v.name) : null)
        names.length >= 0 ?
            names.map((item, index) => 
                options.push({
                    text: item,
                    value: item
                })
        )
        : null
        const panes = [
            { menuItem: { content: 'All Users', icon: 'users'}, 
                pane: (
                    users.length >= 0 ? //Javascript  //? คือ if else Syntax => ... ? true : false
                        users.map((item, index) => //Loop
                            <Segment>
                                <List>
                                <List.Item>
                                    <List.Content>
                                    <List.Header>{item.firstName} {item.lastName}</List.Header>
                                    <List.Content floated='right'>
                                        <Modal trigger={<Button onClick={(e) => this.setUser(item,options)}><Button.Content><Icon name='write'/></Button.Content></Button>}>
                                            <Modal.Header>Edit User</Modal.Header>
                                            <Modal.Content >
                                            <Modal.Description>
                                            <Form onSubmit={this.editUser}>
                                                <Form.Field required>
                                                    <label>First Name</label>
                                                    <Form.Input name='firstNameModal' value={this.state.firstNameModal} onChange={this.handleChangeModal} placeholder='First Name' />
                                                </Form.Field>
                                                <Form.Field required>
                                                    <label>Last Name</label>
                                                    <Form.Input name='lastNameModal' value={this.state.lastNameModal} onChange={this.handleChangeModal} placeholder='Last Name' />
                                                </Form.Field>
                                                <Form.Field required>
                                                    <label>Department</label>
                                                    <Dropdown placeholder='Select Department' name='departmentModal' onChange={this.handleChangeModal} fluid search selection options={this.state.options} defaultValue={this.state.options[this.state.defaultDepartment].value}/>
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>E-mail</label>
                                                    <Form.Input name='emailModal' value={this.state.emailModal} type='email' onChange={this.handleChangeModal} placeholder='E-mail' />
                                                </Form.Field>
                                                <Form.Field>
                                                    <label>Phone</label>
                                                    <Form.Input name='telModal' value={this.state.telModal} onChange={this.handleChangeModal} placeholder='Phone' />
                                                </Form.Field>
                                                <Form.Button content='Submit' />
                                            </Form>
                                            </Modal.Description>
                                            </Modal.Content>
                                        </Modal>
                                        <Button onClick={(e) => this.deleteUser(item)}><Button.Content><Icon name='remove user'/></Button.Content></Button>
                                    </List.Content>
                                    {item.department}
                                    </List.Content>
                                </List.Item>
                                </List>
                            </Segment>
                        )
                        : null
                ) },
            { menuItem: { content: 'New User', icon: 'add user'},
                pane: (
                    <Tab.Pane>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field required>
                                <label>First Name</label>
                                <Form.Input name='firstName' value={firstName} onChange={this.handleChange} placeholder='First Name' />
                            </Form.Field>
                            <Form.Field required>
                                <label>Last Name</label>
                                <Form.Input name='lastName' value={lastName} onChange={this.handleChange} placeholder='Last Name' />
                            </Form.Field>
                            <Form.Field required>
                                <label>Username</label>
                                <Form.Input name='username' value={username} onChange={this.handleChange} placeholder='Username' />
                            </Form.Field>
                            <Form.Field required>
                                <label>Password</label>
                                <Form.Input name='password' value={password} type='password' onChange={this.handleChange} placeholder='Password' />
                            </Form.Field>
                            <Form.Field required>
                                <label>Department</label>
                                <Dropdown placeholder='Select Department' name='department' onChange={this.handleChange} fluid search selection options={options} />
                                </Form.Field>
                            <Form.Field>
                                <label>E-mail</label>
                                <Form.Input name='email' value={email} type='email' onChange={this.handleChange} placeholder='E-mail' />
                            </Form.Field>
                            <Form.Field>
                                <label>Phone</label>
                                <Form.Input name='tel' value={tel} onChange={this.handleChange} placeholder='Phone' />
                            </Form.Field>
                            <Form.Button content='Submit' />
                        </Form>
                    </Tab.Pane>
              ) },
          ]
        return (
            <div>
                <Tab panes={panes} renderActiveOnly={false} />
            </div>
        );
    }
}

export default Users;