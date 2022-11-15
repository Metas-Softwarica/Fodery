part of 'authcheck_bloc.dart';

abstract class AuthcheckEvent extends Equatable {
  const AuthcheckEvent();

  @override
  List<Object> get props => [];
}

class AuthCheckaAttempt extends AuthcheckEvent {}
