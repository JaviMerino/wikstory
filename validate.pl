#!/usr/bin/perl

use common::sense;
use File::Slurp;

use WebService::Validator::HTML::W3C;
use WebService::Validator::CSS::W3C;

sub print_val_results($$$)
{
    my ($v, $ret, $fname) = @_;

    if ($ret) {
        if ($v->is_valid) {
            printf("$fname is valid\n");
            return 0;
        } else {
            printf("$fname is not valid\n");
            foreach my $error (@{$v->errors}) {
                printf("%s at line %d\n", $error->msg,
                       $error->line);
            }
            return -1;
        }
    } else {
        printf("Failed to validate the file: %s\n", $v->validator_error);
        return -1;
    }
}

sub validate_html()
{
    my $file = "wwii.html";
    my $v = WebService::Validator::HTML::W3C->new(
        detailed    =>  1
        );

    my $ret = $v->validate_file($file);
    print_val_results($v, $ret, $file);
}

sub validate_css()
{
    my $fname = "screen_desktop.css";
    my $css = read_file($fname);
    my $v = WebService::Validator::CSS::W3C->new();

    my $ret = $v->validate(string => $css);
    print_val_results($v, $ret, $fname);
}

my $ret = 0;

$ret |= validate_html();
$ret |= validate_css();

exit($ret);
