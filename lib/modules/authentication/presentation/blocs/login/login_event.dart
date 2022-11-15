part of 'login_bloc.dart';

abstract class LoginEvent extends Equatable {
  const LoginEvent();

  @override
  List<Object> get props => [];
}

class LoginClickedEvent extends LoginEvent {
  final UserAuthModel authModel;

  const LoginClickedEvent({required this.authModel});
}
